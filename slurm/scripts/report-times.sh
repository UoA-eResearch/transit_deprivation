#!/bin/bash

find logs/jobs/ -type f -name "*.out" -exec tail -n 1 {} \;
