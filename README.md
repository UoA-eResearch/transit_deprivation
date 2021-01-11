Download and extract data.tar.gz from Dropbox
This will include data for all the subprojects:

* data/frontend
* data/backend
* data/notebooks

in each of the required directories, create a symlink to the corresponding data folder e.g.
```
cd app/frontend/src/store
ln -s ../../../../data/frontend data
```

```
cd app/backend
ln -s ../../data/backend data
```

```
cd notebooks
ln -s ../data/notebooks data
```

