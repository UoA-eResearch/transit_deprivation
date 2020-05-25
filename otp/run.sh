#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "required arguments: [ROUTER] [PORT]"
    exit 1
fi

router="${1}"
port="${2}"
let secure_port="${port}"+1000
root=/nesi/project/uoa03026/otp

tmpdir="/tmp"
if [ ! -z "${TMPDIR}" ]; then
	tmpdir="${TMPDIR}"
fi

echo "starting otp (${router}) on $(hostname):${port} (${secure_port})"
java -Djava.io.tmpdir="${tmpdir}" -Xmx2G -jar "${root}/otp.jar" --basePath "${root}" --graphs "${root}/graphs" --router "${router}" --server --port "${port}" --securePort "${secure_port}"
