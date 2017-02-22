#!/bin/bash

while [ TRUE ]; do
	git pull > output.txt
	abort=$(cat output.txt | grep "Abort")
	length=${#abort}
	echo $abort
	cat output.txt
	if [ $length -gt 0 ]; 
	then
		exit
		fi

	sleep 5
	done  
