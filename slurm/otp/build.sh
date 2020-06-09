#!/bin/bash

# note opt does not like symlinks

java -Xmx2G -jar otp.jar --basePath "${PWD}" --build "${PWD}/auckland"
#java -Xmx2G -jar otp.jar --basePath "${PWD}" --build "${PWD}/wellington"
#java -Xmx2G -jar otp.jar --basePath "${PWD}" --build "${PWD}/christchurch"
