# Red Hat Enterprise Edition

This note is to summarize for VM creation, some RHEL command and to prepare for Kubernetes deployment.

## Create Redhat VM in vsphere

Open the VSphere console using a web browser supporting Flash (Firefox) and create a new virtual machine under the expected folder.

<img src="assets/docs/studies/vm-rhel/vsphere-01.png" width="75%" style="padding 20px;"></img>

In first screen enter the virtual machine name (e.g. green-icp4d-master01) and the location (e.g. CSPLAB > CASE_GREEN )
<img src="assets/docs/studies/vm-rhel/vm-01.png" width="100%" style="padding 20px;"></img>

Select the resource pool to be used (e.g. Green)

<img src="assets/docs/studies/vm-rhel/vm-02.png" width="100%" style="padding 20px;"></img>

Select the datastore in which the hard disk will be provisionned (e.g. CASE_GREEN)

<img src="assets/docs/studies/vm-rhel/vm-03.png" width="100%" style="padding 20px;"></img>

Select the compatibility (ESXI 6.5...)

<img src="assets/docs/studies/vm-rhel/vm-04.png" width="100%" style="padding 20px;"></img>

Select the Guest OS: Linux, RHEL 7.

<img src="assets/docs/studies/vm-rhel/vm-05.png" width="100%" style="padding 20px;"></img>

Then the most important screen is about the hardware configuration. It will depend on the type of software to install on it. For Kubernetes / ICP the master node needs 8 CPUs, 16 GB memory and 750 GB disk. For master node we need a `Thick provision eager zeroed` for worker nodes `Thin provision` is fine. The Virtual Network needs to be the one where all the hosts are connected (e.g. csplab). 

<img src="assets/docs/studies/vm-rhel/vm-06.png" width="100%" style="padding 20px;"></img>

The final confirmation screen:

<img src="assets/docs/studies/vm-rhel/vm-07.png" width="100%" style="padding 20px;"></img>

Let the VM creation terminating. When done start the VM with the Green Arrow, the operating system will be installed via the PXE Server.

<img src="assets/docs/studies/vm-rhel/vm-08.png" width="100%" style="padding 20px;"></img>



<img src="assets/docs/studies/vm-rhel/vm-09.png" width="75%" style="padding 20px;"></img>

Version...


<img src="assets/docs/studies/vm-rhel/vm-10.png" width="75%" style="padding 20px;"></img>

The RHEL installation wizard start: select the language (English US), keyboard, time zone, partition creation...

<img src="assets/docs/studies/vm-rhel/vm-11.png" width="100%" style="padding 20px;"></img>

Set the `root` user password and add `admin` user as an administrator role. On the successful installed message click the `reboot` button. 



* Then login using the admin user. Get the IP address

```shell
$ ip addr
ens192:
   inet 172.16.254.87
```

*  if needed, you can set a static IP address, by doing the following commands:

```shell
# list interfaces and IP addresses
$ nmcli -p dev
DEVICE  TYPE      STATE      CONNECTION 
--------------------------------------------------------------
ens192  ethernet  connected  ens192     
lo      loopback  unmanaged  --       
# Get IP address for the gateway and subnet
$ ip r

# Update the config of the main interface (e.g. ens192) with the IP address and other Gateway and DNS settings:
$ vi /etc/sysconfig/network-scripts/ifcfg-ens192

IPV6INIT=no
BOOTPROTO=none
IPADDR=172.16.52.140
PREFIX=16
GATEWAY=172.16.255.250
TYPE=Ethernet
# Set dns servers #
DNS1=172.16.0.11
DNS2=172.16.0.17
DNS3=8.8.8.8
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
# restart network or reboot the VM
$ systemctl restart network
```

# Verify network

```shell
$ ip a s ens192
$ ip r
$ cat /etc/resolv.conf
```


* try to ssh to it from your computer.

```shell
$ ssh admin@172.16.254.87
```

* Add admin user as sudoers

```shell
usermod -aG wheel admin
```

* Define a hostname

Before subscribing to Redhat service we need to define a hostname.

```shell
$ hostnamectl set-hostname green-icp4d-master01 
```

* Enable subscription to Red hat Content Delivery Network

The subscription service provides a mechanism to handle Red Hat software inventory and allows you to install additional software. Use your Redhat account.

```shell
$ subscription-manager register
The system has been registered with ID: 73e6b89d...
The registered system name is: green-icp4d-master01

# display a list of all subscriptions that are available for your system
$ subscription-manager list --available
# From the output get the Pool ID, and then attach a subscription for: Red Hat Developer Subscription by doing the following:
$ subscription-manager attach --pool=8a85f...
# verify the list of subscriptions your system has currently attached
$ subscription-manager list --consumed
```

* Software repositories
When a system is subscribed to the Red Hat Content Delivery Network, a repository file is created in the `/etc/yum.repos.d/` directory.

```shell
$ yum repolist
# Install  wget, as we need to get our own configuration or product
$ yum install wget
# Add CSP lab local repository
$ wget http://storage4.csplab.local/storage/csplab.repo.rhel75
$  cp csplab.repo.rhel75 /etc/yum.repos.d/csplab.repo
$ yum clean all
```

* Install NFS client and mount `/storage` folder from NFS server:

```shell
# Assess if it NFSclient is installed
$ rpm -q nfs-utils
$ yum install nfs-utils
# Then mount CSP lab storage from NFS server
$ mkdir nfsstorage && mount storage4.csplab.local:/storage nfsstorage
```

### Install docker

From the mounted file system (/storage) there is an ICP folder with the docker bin. To install use:

```shell
$ sudo ./icp-docker-18.03.1_x86_64.bin --install
$ docker version
```

To limit the size of the log over time, modify the file `/lib/systemd/system/docker.service` as following: 
` ExecStart=/usr/bin/dockerd --log-opt max-size=10m --log-opt max-file=10`

Reload and restart Docker:

```shell
$ systemctl daemon-reload
$ systemctl restart docker
```

### Adding disks

When the operating system is installed it is possible to add more virtual disks. We can add 2 disks, both in thin provisioning, and with 450GB and 200GB respectively for the master nodes and 450G 500G for the workers. When the VM is stopped, use the Edit button in the `Configuration` tab and Add Device, select Hard disk, define the size and provisioning mechanism and add disk.

When the VM is restarted define new partitions. (see this [tutorial on GNU 'parted' tool](https://linuxconfig.org/how-to-manage-partitions-with-gnu-parted-on-linux)).   

XFS is the default file system in Red Hat Enterprise Linux 7. 

Some import commands:

* The `df -h` command reports the system's disk space usage.
* The `du` command displays the estimated amount of space being used by files in a directory

The `/dev/` directory contains device nodes that represent devices attached to the system and virtual devices provided by the kernel.

To see the available disks:

```shell
$ ls -al /dev/sd*
# list current partitions
$ parted -l 
```

To create disk partitions for a given dick and format them with XFS with ftype enabled do:

```shell
# Create a label of type gpt
$ parted /dev/sdb --script mklabel gpt
# Create a primary partition for 100% of the disk size as defined with VM configuration
$ parted /dev/sdb  --script mkpart primary '0%' '100%'
# Build the filesystems on top of those paritions
$ mkfs.xfs -f -n ftype=1 -i size=512 -n size=8192 /dev/sdb1
$ mkfs.xfs -f -n ftype=1 -i size=512 -n size=8192 /dev/sdc1
$ lsblk
```

Add mount points, create target directories, and add those lines in `/etc/fstab` file, and do a `mount -a` to mount the XFS filesystem.

```shell
/dev/sdb1      /ibm    xfs     defaults,noatime        1 2
/dev/sdc1      /data   xfs     defaults,noatime        1 2
```

A new lsblk returns:

```shell
NAME          MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
fd0             2:0    1    4K  0 disk 
sda             8:0    0  100G  0 disk 
├─sda1          8:1    0    1G  0 part /boot
└─sda2          8:2    0   99G  0 part 
  ├─rhel-root 253:0    0   50G  0 lvm  /
  ├─rhel-swap 253:1    0  7.9G  0 lvm  [SWAP]
  └─rhel-home 253:2    0 41.1G  0 lvm  /home
sdb             8:16   0  449G  0 disk 
└─sdb1          8:17   0  449G  0 part /ibm
sdc             8:32   0  192G  0 disk 
└─sdc1          8:33   0  192G  0 part /data
sr0            11:0    1 1024M  0 rom  
```

See [this RHEL note](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/storage_administration_guide/ch-filesystem) on filesystems.

> As we can see in the device list above, when installing the operating system, the sda disk was 100GB but it was splitted into two partitions mounted on `/` and `/home`. It is possible to reclaim the space and have one partition for `/`
* First copy the content of /home to another partition and then `unmount /home`
* List current volumes: `pvdisplay -s` and / or `vgdisplay -s`.  It should return something like:
```
  "rhel" <99.00 GiB [98.99 GiB used / 4.00 MiB free]
```
* Remove the logical volume: `lvremove /dev/mapper/rhel-home` 
* Extend the existing partition for the root ` lvextend -l +100%FREE -r /dev/mapper/rhel-root`
* Remove the /home entry in the /etc/fstab file.

```shell
$ df -h
Filesystem            1K-blocks    Used Available Use% Mounted on
/dev/mapper/rhel-root   92G  1.6G   90G   2% /
devtmpfs               7.8G     0  7.8G   0% /dev
tmpfs                  7.8G     0  7.8G   0% /dev/shm
tmpfs                  7.8G  8.9M  7.8G   1% /run
tmpfs                  7.8G     0  7.8G   0% /sys/fs/cgroup
/dev/sdc1              192G   33M  192G   1% /data
/dev/sda1             1014M  142M  873M  15% /boot
/dev/sdb1              449G   33M  449G   1% /ibm
tmpfs                  1.6G     0  1.6G   0% /run/user/0
```

### Extending disk

Using the vSphere console add space to an existing volume while the VM is stopped. Then restart the VM and do the following steps:

```shell
# Assess the size of the physical disk is valid using: (we suppose /dev/sdc is the disk extended)
$ fdisk -l /dev/sdc
Disk /dev/sdc: 429.5 GB, 429496729600 bytes, 838860800 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0x00000000

   Device Boot      Start         End      Blocks   Id  System
/dev/sdc1               1   402653183   201326591+  ee  GPT

```

The logical volume does not match the physical size. The view of the partition definitions confirm that: The first disk (sda) has 2 partitions, the second has one that use the full space available, the last one (sdc) has one partition that does not match the physical size.
```shell
$ cat /proc/partitions
major minor  #blocks  name

   2        0          4 fd0
   8        0  104857600 sda
   8        1    1048576 sda1
   8        2  103808000 sda2
   8       16  470810624 sdb
   8       17  470808576 sdb1
   8       32  419430400 sdc
   8       33  201324544 sdc1
```

Backup the content of the mounted directory and then use `fdisk` to delete existing partition and recreate a new one (it is a step by step wizard).

```shell
$ fdisk /dev/sdc
# update in memory view of the partiti
$ partx -u /dev/sdc
$ cat /proc/partitions
# Then grow the xfs filesystem, for example on the mounted /data fs:
$ xfs_growfs /data
```
Restart the VM.

The new report from `lsblk`:
```
sdc             8:32   0  400G  0 disk 
└─sdc1          8:33   0  400G  0 part /data
```

## Install ICP

Study the training https://www.ibm.com/cloud/garage/content/course/ibm-cloud-private-installation/1 and the product documentation https://www.ibm.com/support/knowledgecenter/en/SSBS6K_3.1.2/installing/install_containers.html

* Be sure to have the necessary hardware settings for each virtual machine. See this [preparation instructions](https://www.ibm.com/support/knowledgecenter/en/SSBS6K_3.1.2/installing/prep_cluster.html). Each server needs at least 50G under /. Use `df` to assess size.
* The security groups need to set the public/private network to be ingress "allow_all". So first disable the firewalls and change the Security Enhanced Linux to permissive:

```shell
systemctl stop firewalld
systemctl disable firewalld
vi /etc/selinux/config
```
* Verify docker is running, if not perform the following:

```shell
$ sudo systemctl enable docker
$ sudo systemctl start docker
```
* Get the tar files for docker and icp. 
* Extract the docker images from the tar using the command: `tar xf ibm-cloud-private-x86_64-3.1.2.tar.gz -O | sudo docker load`.
* Create an installation directory to store the IBM Cloud Private configuration files (/opt/ibm/icp-3.2.1). Change ownership of the folder
* Extract configuration file: `sudo docker run -v $(pwd):/data -e LICENSE=accept ibmcom/icp-inception-amd64:3.1.2-ee cp -r cluster /data`
* Modify the `hosts` file to set ip address of proxy, master, va, workers, management
* Create SSH key from the master server and copy them to each host. [See this note](https://www.ibm.com/support/knowledgecenter/en/SSBS6K_3.1.2/installing/ssh_keys.html). Then in the `cluster` folder replace the ssh_key file with the private key file that is used to communicate with the other cluster nodes
* Set automatic docker install in each cluster nodes. (Docker is automatically installed on your Red Hat Enterprise Linux (RHEL) or Ubuntu cluster nodes) See [this note](https://www.ibm.com/support/knowledgecenter/en/SSBS6K_3.1.2/installing/docker_cluster.html)
* Add a password_rules in the config.yml 
* Start the installation: `sudo docker run --net=host -t -e LICENSE=accept -v "$(pwd)":/installer/cluster ibmcom/icp-inception-amd64:3.1.2-ee install`
* Verify the installation by accessing the console with the master ip address and port 8443. 

#### ICP4Data

Installation instructions: 
https://docs-icpdata.mybluemix.net/install/com.ibm.icpdata.doc/zen/install/standovu.html

Pre-requisites to prepare VMs: 
https://docs-icpdata.mybluemix.net/install/com.ibm.icpdata.doc/zen/install/reqs-ent.html