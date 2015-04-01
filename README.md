# WebProjectTemplate
A template for starting web projects



# Set up

### Install NodeJs
https://nodejs.org/

### install gulp for node
```sh
npm install -g gulp

```

### install dependencies for project
```sh
cd /your-project-file-location

npm install
```

### start dev server
```sh
gulp serve
```




###Behind a proxy
install Cntlm
http://cntlm.sourceforge.net/


modify C:\Program Files (x86)\Cntlm\cntlm.ini
```
Username    testuser
Domain    corp-uk
```

open command prompt to C:\Program Files (x86)\Cntlm
```
cntlm -c cntlm.ini -H
```
once you enter your password you'll get 3 hashes

modify these lines in cntlm.ini with whatever hash the commandline gave
```
PassLM 1AD35398BE6565DDB5C4EF70C0593492
PassNT 77B9081511704EE852F94227CF48A793
PassNTLMv2 D5826E9C665C37C80B53397D5C07BBCB

//also change the port if you want to
```


restart cntlm. Put into your bash_profile
alias proxy="http_proxy=http://localhost:[port] https_proxy=http://localhost:[port]";

now we can type the following to get through the proxy
"proxy npm install" instead of "npm install" which doesn't get anywhere
