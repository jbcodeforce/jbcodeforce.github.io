import os
import json, requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


corePlatformURL      = os.environ.get('corePlatformURL', 'https://localhost:19443')
corePlatformName     = "Core Platform"
isDebug = False


def printResponse(response):
    prettyResponse = json.dumps(response.json(), indent=4)
    print(" ")
    print("Response: ")
    print(prettyResponse)
    print(" ")

def printRestRequest(url):
    print (" ")
    print (url)
    
def printRestRequestBody(body):   
    prettyBody = json.dumps(body, indent=4)
    print (prettyBody)
    print (" ")
    
def printRestResponse(response): 
    print ("Returns:")
    prettyResponse = json.dumps(response.json(), indent=4)
    print (prettyResponse)
    print (" ")


def printServiceDescriptions(serverPlatformName, serviceGroupName, services):
    print(serviceGroupName, "for", serverPlatformName)
    for x in range(len(services)):
        serviceName = services[x].get('serviceName')
        serviceDescription = services[x].get('serviceDescription')
        serviceWiki = services[x].get('serviceWiki')    
        print (" * ", serviceName)
        print ("     ", serviceDescription)
        print ("     ", serviceWiki)
    print (" ")

def postAndPrintResult(url, json=None, headers=None):
    print ("   ...... (POST", url, ")")
    response = requests.post(url, json=json, headers=headers)
    print ("   ...... Response: ", response.json())

#
# Rest calls, these functions issue rest calls and print debug if required.
# 
def issuePost(url, body):
    if (isDebug):
        printRestRequest("POST " + url)
        printRestRequestBody(body)
    jsonHeader = {'content-type':'application/json'}
    response=requests.post(url, json=body, headers=jsonHeader)
    if (isDebug):
        printRestResponse(response) 
    return response

def issueDataPost(url, body):
    if (isDebug):
        printRestRequest("POST " + url)
        printRestRequestBody(body)
    jsonHeader = {'content-type':'text/plain'}
    response=requests.post(url, data=body)
    if (isDebug):
        printRestResponse(response) 
    return response

def issuePut(url, body):
    if (isDebug):
        printRestRequest("PUT " + url)
        printRestRequestBody(body)
    jsonHeader = {'content-type':'application/json'}
    response=requests.put(url, json=body, headers=jsonHeader)
    if (isDebug):
        printRestResponse(response) 
    return response

def issueGet(url):
    if (isDebug):
        printRestRequest("GET " + url)
    jsonHeader = {'content-type':'application/json'}
    response=requests.get(url, headers=jsonHeader)
    if (isDebug):
        printRestResponse(response) 
    return response

def getServerPlatformServices(serverPlatformName, serverPlatformURL):
    getOMAGServicesURL = serverPlatformURL + "/open-metadata/platform-services/users/" + adminUserId + "/server-platform/registered-services"
    response = issueGet(getOMAGServicesURL + "/common-services")
    if response.status_code == 200:
        printServiceDescriptions(serverPlatformName, "Common services", response.json().get('services'))
    response = issueGet(getOMAGServicesURL + "/access-services")
    if response.status_code == 200:
        printServiceDescriptions(serverPlatformName, "Access services", response.json().get('services'))
    response = issueGet(getOMAGServicesURL + "/engine-services")
    if response.status_code == 200:
        printServiceDescriptions(serverPlatformName, "Engine services", response.json().get('services'))
    response = issueGet(getOMAGServicesURL + "/integration-services")
    if response.status_code == 200:
        printServiceDescriptions(serverPlatformName, "Integration services", response.json().get('services'))
    response = issueGet(getOMAGServicesURL + "/view-services")
    if response.status_code == 200:
        printServiceDescriptions(serverPlatformName, "View services", response.json().get('services'))
    response = issueGet(getOMAGServicesURL + "/governance-services")
    if response.status_code == 200:
        printServiceDescriptions(serverPlatformName, "Governance services", response.json().get('services'))


getServerPlatformServices(corePlatformName,corePlatformURL)