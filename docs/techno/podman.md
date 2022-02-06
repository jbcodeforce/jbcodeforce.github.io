# Podman as docker cli and daemon

[Getting started from podman.io](https://podman.io/getting-started/)

The official podman installation instructions from the containers organisation are 
to be found [https://podman.io/getting-started/installation](https://podman.io/getting-started/installation)

```
brew install podman
```

To understand how podman works on mac: [podman-mac-machine-architecture](https://www.redhat.com/sysadmin/podman-mac-machine-architecture)

* It runs a virtualized Linux (Fedora CoreOS) distribution using native macOS virtualization
* The Podman client securely communicates with the Linux VM using secure shell (SSH) keys

[How to replace Docker with Podman on a Mac](https://www.redhat.com/sysadmin/replace-docker-podman-macos)

## Summary of CLI

* to create a Linux VM for your containers

```sh
podman machine init
```

The machine description is a text file that describes the attributes of the VM that it will create. 

* Start the VM

```sh
podman machine start
```

The ignition file is injected into the VM during this first boot and then run in the boot process.

The gvproxy application manages port mapping between the host and VM. 
The VM routes its traffic through the host system.  Once the image is pulled successfully, the container runs on the VM.

## Major issues

podman push is not responding


## Tricks

[Official troubleshooting](https://github.com/containers/podman/blob/main/troubleshooting.md)


