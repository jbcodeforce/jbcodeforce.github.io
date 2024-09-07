# Windows Server Linux 2

## Enable it

* Run Powershell as administrator 
* [Product doc](https://learn.microsoft.com/en-us/windows/wsl/install)
* `wsl --install`

[Best practices for WSL](https://learn.microsoft.com/en-us/windows/wsl/setup/environment#set-up-your-linux-username-and-password)

* Check WSL2 running: `wsl -l -v`

[Docker]()https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers is also a WSL2 VM. Ensure that "Use the WSL 2 based engine" is checked in Settings > General.

## Ubuntu

* `lsb_release -a` to see the ubunty release
* To authorise remote desktop to the ubuntu machine install `xrdp`, then use Windows Remote Desktop to connect to the host on port 3389. To get the ip address with `ip addr`   -> 192.168.85.149

## Networking

### Access from remote host to Ubuntu WLS2

On the windows host we need to enable port proxy. Using a powershell terminal 

```sh
netsh interface portproxy add v4tov4 listenport=3389  listenaddress=0.0.0.0 connectport=3389 connectaddress=192.168.85.149
```