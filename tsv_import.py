#!/usr/bin/python
import sys
import csv
import json

tsvProjectFile = open(sys.argv[1], 'r')
projectFile = open('src/projects/repos.json', 'w')

fieldnames = ("projectTitle","projectDescription","featured","category","subcategory", "url", "repoAccount", "repoName", "buttonText", "included")
reader = csv.DictReader( tsvProjectFile, fieldnames, delimiter='\t')
reader.next()
projectFile.write("[")
items = []
for row in reader:
    if row["included"] == "TRUE":
        category = "{\"categories\": [{\"name\": \""+row["category"]+"\"}," + "{\"name\": \""+row["subcategory"]+"\"}"
        if row["featured"] == "TRUE": 
          category += ",{\"name\": \"featured\"}"
        category += "]"
        items.append(category + ", \"title\": \"" + row["projectTitle"] + "\", \"description\": \"" + row["projectDescription"] + "\", \"cta_1_url\": \"" + row["url"] + "\", \"cta_1_text\": \"" + row["buttonText"] + "\", \"repo_account\": \"" + row["repoAccount"] + "\", \"repo_name\": \"" + row["repoName"] + "\"}\n")
projectFile.write(",".join(items))
projectFile.write("]")
projectFile.close()