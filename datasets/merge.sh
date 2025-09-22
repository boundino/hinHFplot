#!/bin/bash

outf=dataset.js

for i in `ls -d js/*` ; do echo $i >> sorttemp.txt ; done

echo "var dataset = {};" > $outf
for i in `LC_COLLATE=C sort -f sorttemp.txt`
do
    echo $i
    echo >> $outf
    cat $i >> $outf
done

rm sorttemp.txt
