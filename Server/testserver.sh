#!/bin/bash

while [ TRUE ]; do
	git pull > output.txt
	abort=$(cat output.txt | grep "Abort")
	length=${#abort}
	echo $abort

	update=$(cat output.txt | grep "Updating")
	length1=${#update}

	echo $abort
	cat output.txt

	if [ $length -gt 0 ]; 
	then
		exit
		fi
	if [ $length1 -gt 0 ]; #update 
	then
		exit
		fi

	sleep 5
	done  
