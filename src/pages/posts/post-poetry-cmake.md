---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'pybind11をpoetry installでビルドする'
pubDate: 2023-08-02
description: 'Pybind11とかCythonとかビルドが必要なものをPoetryを通してビルドする方法。'
image:
    url: 'https://docs.astro.build/assets/full-logo-dark.png'
    alt: 'Astroのロゴ。'
tags: ["Poetry", "CMake"]
---
## 概要
**Poetry** は、Pythonプロジェクトのパッケージ管理ツールです。
pipなど、 `requirements.txt` でパッケージを管理するのと違って、バージョンの情報を細かく管理、仮想環境としてプロジェクトを管理でき、またパッケージ化（setup.pyの生成）も可能など豊富な機能を持っています。

さらに、できることの一つとして**pybind11**や**Cython**などの特定のビルド手順を必要とする自作モジュールについて、パッケージのインストールとともにビルドを走らせることができます。

Pybind11で作ったpythonモジュールを`poetry install`でビルドする方法について調べてたのですが、ネット上での情報が非常に少なく苦労しました...
本記事ではpoetryの大まかな知識を前提に、poetryプロジェクトにpybind11で作ったモジュールを組み込む方法について、説明します。

## バージョン情報など
Poetry 1.6.1

## Poetryプロジェクトの準備
最終的なディレクトリ構造は以下のようになります。

プロジェクトはここに置いてあります。

https://github.com/EndoYuuki/poetry-pybind11

```bash
.
└── poetry-pybind11
    ├── poetry_pybind11     # buildに認識させるための空のプロジェクト
    │   ├── __init__.py
    │   └── __main__.py
    ├── mypybind11lib
    │   ├── pybind11        # 公式リポジトリからcloneしたpybind11
    │   ├── CMakeLists.txt
    │   └── main.cpp
    ├── build.py            # pybind11プロジェクトをビルドするためのスクリプト
    └── pyproject.toml
```

ここで、`mypybind11lib/pybind11`は公式のリポジトリからcloneした（poetry_pybind11をGit管理している場合は）サブモジュールです。

```bash
git submodule add https://github.com/pybind/pybind11 ./mypybind11lib/pybind11
```

## Pybind11プロジェクトを用意
サンプルとして次の足し算を行うpybind11モジュールを用意しました。

`CMakeLists.txt`
```cmake
cmake_minimum_required(VERSION 3.16)

project(mypybind11lib)

add_subdirectory(pybind11)

pybind11_add_module(mypybind11lib MODULE main.cpp)

target_compile_options(mypybind11lib PRIVATE -O2 -Wall)
target_compile_features(mypybind11lib PRIVATE cxx_std_17)
```

`main.cpp`
```cpp
#include <pybind11/pybind11.h>

double add(const double lhs, const double rhs) {
    return lhs + rhs;
}

PYBIND11_MODULE(mypybind11lib, m) {
  using namespace pybind11::literals;

  m.doc() = "simple pybind11 example";
  m.def("add", &add, "add two variables", "lhs"_a, "rhs"_a);
}
```

## build.py
`pyproject.toml`が`build.py`を指定して、パッケージングを行います。
書き方は`setup.py`と類似していて、`poetry install`時には、`build.py`の`build(setup_kwargs)`が呼ばれます。

`build.py`
```python
"""
Adapted from https://github.com/pybind/cmake_example
"""
import os
import platform
import re
import shutil
import subprocess
import sys
import sysconfig
from distutils.version import LooseVersion
from pathlib import Path
from typing import Any, Dict

from setuptools.command.build_ext import build_ext
from setuptools.extension import Extension


class CMakeExtension(Extension):
    name: str  # exists, even though IDE doesn't find it

    def __init__(self, name: str, sourcedir: str = "") -> None:
        super().__init__(name, sources=[])
        self.sourcedir = os.path.abspath(sourcedir)


class ExtensionBuilder(build_ext):
    def run(self) -> None:
        self.validate_cmake()
        super().run()

    def build_extension(self, ext: Extension) -> None:
        if isinstance(ext, CMakeExtension):
            self.build_cmake_extension(ext)
        else:
            super().build_extension(ext)

    def validate_cmake(self) -> None:
        cmake_extensions = [
            x for x in self.extensions if isinstance(x, CMakeExtension)
        ]
        if len(cmake_extensions) > 0:
            try:
                out = subprocess.check_output(["cmake", "--version"])
            except OSError:
                raise RuntimeError(
                    "CMake must be installed to build the following extensions: "
                    + ", ".join(e.name for e in cmake_extensions)
                )
            if platform.system() == "Windows":
                cmake_version = LooseVersion(re.search(r"version\s*([\d.]+)", out.decode()).group(1))  # type: ignore
                if cmake_version < "3.1.0":
                    raise RuntimeError("CMake >= 3.1.0 is required on Windows")

    def build_cmake_extension(self, ext: CMakeExtension) -> None:
        extdir = os.path.abspath(
            os.path.dirname(self.get_ext_fullpath(ext.name))
        )
        cmake_args = [
            "-DCMAKE_LIBRARY_OUTPUT_DIRECTORY=" + extdir,
            "-DPYTHON_EXECUTABLE=" + sys.executable,
        ]

        cfg = "Debug" if self.debug else "Release"
        # cfg = 'Debug'
        build_args = ["--config", cfg]

        if platform.system() == "Windows":
            cmake_args += [
                "-DCMAKE_LIBRARY_OUTPUT_DIRECTORY_{}={}".format(
                    cfg.upper(), extdir
                )
            ]
            if sys.maxsize > 2**32:
                cmake_args += ["-A", "x64"]
            build_args += ["--", "/m"]
        else:
            cmake_args += ["-DCMAKE_BUILD_TYPE=" + cfg]
            build_args += ["--", "-j4"]
        cmake_args += [
            "-DPYTHON_INCLUDE_DIR={}".format(sysconfig.get_path("include"))
        ]

        env = os.environ.copy()
        env["CXXFLAGS"] = '{} -DVERSION_INFO=\\"{}\\"'.format(
            env.get("CXXFLAGS", ""), self.distribution.get_version()
        )
        if not os.path.exists(self.build_temp):
            os.makedirs(self.build_temp)
        subprocess.check_call(
            ["cmake", ext.sourcedir] + cmake_args, cwd=self.build_temp, env=env
        )
        subprocess.check_call(
            ["cmake", "--build", "."] + build_args, cwd=self.build_temp
        )


def build(setup_kwargs: Dict[str, Any]) -> None:
    cmake_modules = [
        CMakeExtension(
            "mypybind11lib",
            sourcedir="mypybind11lib",
        )
    ]
    ext_modules = cmake_modules  # + ...
    setup_kwargs.update(
        {
            "ext_modules": ext_modules,
            "cmdclass": dict(build_ext=ExtensionBuilder),
            "zip_safe": False,
        }
    )
```

ビルドしたいモジュールを追加する際は、次の場所に追加します。
```python
    cmake_modules = [
        CMakeExtension(
            "mypybind11lib",
            sourcedir="mypybind11lib",
        )
    ]
    ext_modules = cmake_modules  # + ...
```

## pyproject.toml
次に`poetry install`時に上のbuild.pyがビルドされるように、`pyproject.toml`を編集します。

```poetry
[tool.poetry]
name = "poetry-pybind11"
version = "0.1.0"
description = ""
authors = ["EndoYuuki <shuckle.rbtech@gmail.com>"]
readme = "README.md"


[tool.poetry.build]
script = "build.py"
generate-setup-file = true

[tool.poetry.dependencies]
python = "^3.8"


[build-system]
requires = ["poetry-core>=1.0.0", "setuptools"]
build-backend = "poetry.core.masonry.api"
```

変更箇所は次の通りです。

```poetry
[tool.poetry.build]
script = "build.py"
generate-setup-file = true
```

`generate-setup-file`と書いてあるけど、生成後はちゃんと消えます。

```poetry
[build-system]
requires = ["poetry-core>=1.0.0", "setuptools"]
```

ビルドの依存関係に`setuptools`を追加します。また`poetry-core`のバージョンも`1.0.0`以上を要求しておきます。


## プロジェクトディレクトリの用意とビルド
ここまでの準備で、`poetry install`したときに、build.pyスクリプトが走り、pybind11がビルドされ仮想環境に*.soファイルがインストールされるようになります。

ただし理由はよくわからないですが、`./プロジェクト名/__init__.py`が存在しないと、build.pyがうまく走りません。

また、ここでpyproject.tomlのプロジェクト名にハイフンが入っていていて、上の__init__.pyがハイフン付きのディレクトリに保存されている場合もうまくビルドできなかったです。
その場合は、ハイフンをアンダースコア（_）に変更したディレクトリを作ってあげると、build.pyが走ります。


## 実行
poetry installでビルドされた、pybind11の出力（*.so）はどこに保存されるのでしょうか。

実は、poetryの仮想環境が保管されている、`$HOME/.cache/pypoetry/virtualenvs/poetry-pybind11-.../lib/python3.8/site-packages`に保存されます。

なので、このpoetryプロジェクト内では、任意の場所からpybind11ライブラリをimportできます。

`poetry_pybind11/__main__.py`
```
import mypybind11lib

if __name__ == "__main__":
    result = mypybind11lib.add(1, 2)
    print("f{result=}")
```


実行すると次のように表示されるはずです。
```bash
poetry run python3 -m poetry_pybind11
```

```
result=3
```
