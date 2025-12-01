Class IRISSyetemCheck.Interface.Rest Extends %CSP.REST
{

Parameter HandleCorsRequest = "true";

XData UrlMap [ XMLNamespace = "http://www.systemCheck.com/urlmap" ]
{
<Routes>
  <Route Url="/widgets" Method="GET" Call="Widgets"/>
  <Route Url="/savewidgets" Method="POST" Call="SaveWidgets"/>
   <Route Url="/initialization" Method="POST" Call="initialization"/>
 

  <Route Url="/*" Method="Options" Call="Status"/>
  <Route Url="/:Method" Method="Get" Call="SystemCheck"/>

  
</Routes>
}

ClassMethod Status() As %Status
{
    Quit $$$OK
}

ClassMethod SystemCheck(method As %String) As %Status
{
	try{
		if method="LargePagesEnabled"{
			Set status=..LargePagesEnabled(.pOutput)
		}elseif(method="ProcessMemory"){
			Set status=..ProcessMemory(.pOutput)
		}elseif(method="VirtualIP"){
			Set status=..VirtualIP(.pOutput)
		}elseif(method="MirrorDatabase"){
			Set status=..MirrorDatabase(.pOutput)
		}elseif(method="GlobalBuffer"){
			Set status=..GlobalBuffer(.pOutput)
		}elseif(method="GlobalBuffer"){
			Set status=..GlobalBuffer(.pOutput)
		}else{
			Set pOutput=..Failure("Incorrect request path")
		}
	}catch(ex){
		Set pOutput=..Failure("Request error. Please check the program")
	}
	w pOutput
    Quit $$$OK
}

ClassMethod LargePagesEnabled(Output pOutput As %String) As %Status
{
	Set config=##Class(Config.config).Open()
	Set configItem=config.LargePagesDisabled
	if configItem=0{
		Set response="The large page configuration has been enabled"
	}else{
		Set response="The large page configuration is not enabled"
	}
	Set pOutput=response
    Quit $$$OK
}

ClassMethod ProcessMemory(Output pOutput As %String) As %Status
{
	Set config=##Class(Config.config).Open()
	Set pOutput="Maximum Per-Process Memory set to "_config.bbsiz
    Quit $$$OK
}

ClassMethod VirtualIP(Output pOutput As %String) As %Status
{
	Set MirrorName=$SYSTEM.Mirror.MirrorName()
	if ""=MirrorName{
		Set pOutput="This instance is not a mirror member and has not configured a virtual IP"
	}else{
		Set queryStr="select VirtualAddress from Config.Mirrors where name ='"_MirrorName_"'AND SectionHeader='Mirrors'"
   		Set statement = ##class(%SQL.Statement).%New()
		Set qStatus = statement.%Prepare(.queryStr)
		if qStatus'=1 {DO $System.Status.DisplayError(qStatus)}
		#dim rset As %SQL.StatementResult = statement.%Execute()
		Set Vip=""
		if (rset.%Next()){
			set Vip=rset.%Get("VirtualAddress")
		}
		if ""=Vip{
			Set pOutput="A virtual ip has not been configured for this instance"
		}else{
			Set pOutput="A virtual IP("_$P(Vip,"/")_") has been configured for this instance"
		}
		
	}
    Quit $$$OK
}

ClassMethod MirrorDatabase(Output pOutput As %String) As %Status
{
    If ($System.Mirror.IsMember() = 0) {
	    set pOutput="This instance is not a mirror member and has not mirror database"
    }else{
	    Set queryStr="call Config.Databases_MirrorDatabaseList()"
		Set statement = ##class(%SQL.Statement).%New()
		Set qStatus = statement.%Prepare(queryStr)
		if qStatus'=1 {DO $System.Status.DisplayError(qStatus)}
		#dim rset As %SQL.StatementResult = statement.%Execute()
    	set MirrorDatabase=""
		while rset.%Next(){
			set MirrorDatabase = MirrorDatabase_rset.%Get("Name")_","
		}
		if ""=MirrorDatabase{
			set pOutput="This instance has not mirror database"
		}else{
			set pOutput="This instance has mirror database("_$e(MirrorDatabase,1,*-1)_")"
		}
	}
    
    Quit $$$OK
}

ClassMethod GlobalBuffer(Output pOutput As %String) As %Status
{
	Set config=##Class(Config.config).Open()
	Set configItem=config.globals8kb
	if configItem=0{
		Set response="The global buffer is configured in proportion to the available physical memory"
	}else{
		Set response="The global buffer is not configured in proportion to the available physical memory"
	}
	Set pOutput=response
    Quit $$$OK
}

ClassMethod Success(pRequest As %RegisteredObject) As %String
{
	Set response = ##class(%DynamicObject).%New()
	Set response.code=200
	Set response.data=pRequest
	Set response.msg=""
	Quit response.%ToJSON()
}

ClassMethod Failure(pRequest As %RegisteredObject) As %String
{
	Set response = ##class(%DynamicObject).%New()
	Set response.code=400
	Set response.data=pRequest
	Set response.msg=""
	Quit response.%ToJSON()
}

ClassMethod Widgets()
{


	
	//set ^temp1125="**"
	w ^widgtconfig,!
	quit $$$OK
}

ClassMethod SaveWidgets()
{
  set ^widgtconfig=%request.Content.Read()
}

ClassMethod initialization() As %Status
{
	set ip=%request.Content.Read()
	   if (^widgtconfig="{}")&&(^widgtconfig("flag")=0)
   {
	   set ip=$p(ip,":",1)
	   	set temp={"widgets":[{"id":"widget_1764129069307_2my29quxt","title":"LargePagesEnabled","type":"data","apiUrl":"http://localhost:52773/api/SystemCheck/LargePagesEnabled","apiMethod":"GET","apiHeaders":"","apiBody":"","refreshInterval":0,"enabled":true,"createdAt":"2025-11-26T03:51:09.307Z"},{"id":"widget_1764129217300_amd75jtsc","title":"ProcessMemory","type":"data","apiUrl":"http://localhost:52773/api/SystemCheck/ProcessMemory","apiMethod":"GET","apiHeaders":"","apiBody":"","refreshInterval":0,"enabled":true,"createdAt":"2025-11-26T03:53:37.301Z"},{"id":"widget_1764129319496_zwdz3cw4s","title":"VirtualIP","type":"data","apiUrl":"http://localhost:52773/api/SystemCheck/VirtualIP","apiMethod":"GET","apiHeaders":"","apiBody":"","refreshInterval":0,"enabled":true,"createdAt":"2025-11-26T03:55:19.496Z"},{"id":"widget_1764129434034_bvusdsv2j","title":"MirrorDatabase","type":"data","apiUrl":"http://localhost:52773/api/SystemCheck/MirrorDatabase","apiMethod":"GET","apiHeaders":"","apiBody":"","refreshInterval":0,"enabled":true,"createdAt":"2025-11-26T03:57:14.034Z"},{"id":"widget_1764129444544_o9v15ketu","title":"GlobalBuffer","type":"data","apiUrl":"http://localhost:52773/api/SystemCheck/GlobalBuffer","apiMethod":"GET","apiHeaders":"","apiBody":"","refreshInterval":0,"enabled":true,"createdAt":"2025-11-26T03:57:24.544Z"}]}
	    set ^widgtconfig=$replace(temp.%ToJSON(),"localhost",ip)
	    set ^widgtconfig("flag")=1
   }
	w ^widgtconfig,!
	 Quit $$$OK
}

}
