@echo off

set PYTHON=
set GIT=
set VENV_DIR=
set COMMANDLINE_ARGS=--lowvram --precision full --no-half --always-batch-cond-uncond --opt-split-attention-v1

call webui.bat
