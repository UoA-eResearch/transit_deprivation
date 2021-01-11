Download and extract data.tar.gz from Dropbox
This will include data for all the subprojects:

* data/frontend
* data/backend
* data/notebooks

in each of the corresponding directories, create a symlink to the data folder e.g.
```
cd frontend
ln -s ../../data/frontend data
```

