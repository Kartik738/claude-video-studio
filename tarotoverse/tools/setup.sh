#!/bin/bash
# Creates a private Python environment for the Tarotoverse effect tools.
set -e
cd "$(dirname "$0")"
if [ ! -x .venv/bin/python ]; then
  python3 -m venv .venv
fi
.venv/bin/pip install -q --upgrade pillow numpy scipy
.venv/bin/python -c "import PIL, numpy; print('Tarotoverse tools ready:', 'Pillow', PIL.__version__, 'NumPy', numpy.__version__)"
