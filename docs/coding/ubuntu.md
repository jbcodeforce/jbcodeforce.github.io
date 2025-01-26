# Ubuntu

Installation
- get image from http://releases.ubuntu.com/16.04/ubuntu-16.04.3-server-amd64.iso
- See also the note there : https://github.ibm.com/CASE/jasper/wiki/How-to-CSPlab
- install the vmware tools using the VMWare fusion > virtual machine 
( cognitive-app user/user01)  jerome boyer (Julie1507)

- select GRUD for boot management
unzip the .gz file on the Desktop folder and then open terminal
sudo ./
- update the ubuntu repository
path-get update
apt-get update
- verify the operating version
	1. Type any one of the following command to find os name and version in Linux:
	   cat /etc/os-release
	   lsb_release -a
	   hostnamectl

- once basic settings are done change root password
sudo su -
passwd
root@hostname:~#  passed
- make your user a sudden
usermod -aG sudo username
- install very light desktop with 
sudo apt-get install xubuntu-desktop
or
sudo apt-get install --no-install-recommends ubuntu-desktop
to remove
sudo apt-get remove ubuntu-desktop
- set hostname
sudo hostname juvm
- install ssh
sudo apt-get install openssh-server 
systemctl restart ssh

- create ssh keys for root and authorize ssh
# create rsa keys with no passphrase 
$ ssh-keygen -t rsa -P ‘'
> it adds two key under user/.ssh folder  : id_rsa and public key id_rsa.pub
# be sure the following are enabled 
$ vi  /etc/ssh/sshd_config
PermitRootLogin yes
PubkeyAuthentication yes
PasswordAuthentication yes

$ systemctl restart ssh
$ ssh-copy-id -i .ssh/id_rsa root@juvm

Then you should be able to ssh via root too
- install NTP to keep time sync
apt-get install -y ntp
sytemctl restart ntp
# test it
ntpq -p
- Install Linux image extra packages
apt-get install -y linux-image-extra-$(uname -r) linux-image-extra-virtual
- assess the linux version
cat /etc/os-release
- install docker
# install docker repository
$ apt-get install -y apt-transport-https ca-certificates curl software-properties-common
# get the GPG key
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
apt-key fingerprint 0EBFCD88

# setup docker stable repository
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb\_release -cs) stable”
apt-get update
apt-get install -y docker-ce
# validate it runs
docker run hello-world
- Add user to docker group
# Verify docker group is here
$ cat /etc/group
# add user
$ usermod -G docker -a jerome
# relogin the user to get the group assignment at the session level
- install node



- install python
apt-get install -y python-setuptools
easy_install pip
pip install docker-py
- install java

add-apt-repository ppa:webupd8team/java
sudo apt install openjdk-8-jdk-headless

- disable firewall
sudo ufw disable


- share folder with host machine
Install VMware tools
1. Launch VMware Fusion.
2. Power off the virtual machine.
3. Click Virtual Machine > Settings.
4. Click Sharing.
5. In Fusion 8.x and 7.x, select Enable Shared Folders
6. Host Guest File System (HGFS) folder  by cd /mnt/hgfs
# Install Open VM tools
$ sudo apt-get install open-vm-tools-desktop
# select the default settings during installation

# mount
$ sudo /usr/bin/vmhgfs-fuse -o auto_unmount .host:/Code /mnt/hgfs/Code



- Adding space on disk after configuration:
At installation phase, Ubuntu creates the default filesystem using LVM. This will create a volume group and logical volumes for swap and root only
The first disk (used for the root filesystem) will be /dev/sda, the second disk will be /dev/sdb. The first partition on /dev/sda is /dev/sda1, the second partition is /dev/sda2
$ ls /dev/sd*

Add partition with gparted

sudo apt-get install gparted

sudo gparted




 http://www.geoffstratton.com/expand-hard-disk-ubuntu-lvm
After you make the additional space available in VMWare/Xen/Hyper-V, first reboot your Ubuntu server: 
# if not installed 
$ apt install lvm2
# get current partition map
$ parted
(parted) print free



so 32G free space. 
Create a new device 
$ cfdisk
# then select the red space, the New, specify the type as linux and finally write to create the partition.


$ fdisk -l /dev/sda
root@juvm:~# fdisk -l /dev/sda
Disk /dev/sda: 50 GiB, 53687091200 bytes, 104857600 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xc6984a21

Device     Boot    Start       End  Sectors  Size Id Type
/dev/sda1  *        2048  36544511 36542464 17.4G 83 Linux
/dev/sda2       36546558  41940991  5394434  2.6G  5 Extended
/dev/sda3       41940992 104857599 62916608   30G 83 Linux
/dev/sda5       36546560  41940991  5394432  2.6G 82 Linux swap / Solaris


initialize it as a Physical Volume
$ pvcreate /dev/sda3
$ pvdisplay
  --- Physical volume ---
  PV Name               /dev/sda3
  VG Name               myvolumegrp
  PV Size               30.00 GiB / not usable 0   
  Allocatable           yes 
  PE Size               4.00 MiB
  Total PE              7680
  Free PE               7680
  Allocated PE          0
  PV UUID               6K4QlE-n3Kf-5ifn-ZdfM-hJTM-vwjO-wQYmAT


Create a volume group and add the physical volume to it
$ vgcreate myvolumegrp /dev/sda3
$ vgscan
# create a logical volume
root@juvm:~# lvcreate -l 100%FREE -n mylv myvolumegrp
  Logical volume "mylv" created.

$ root@juvm:~# lvdisplay
  --- Logical volume ---
  LV Path                /dev/myvolumegrp/mylv
  LV Name                mylv
  VG Name                myvolumegrp
  LV UUID                Z3CDcC-GrNx-6PiR-DbJd-N2FX-SJbk-nAtAqu
  LV Write Access        read/write
  LV Creation host, time juvm, 2017-08-28 14:33:21 -0700
  LV Status              available
  # open                 0
  LV Size                30.00 GiB
  Current LE             7680
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           253:0



To remove a logical volume: 
