Class IRISSyetemCheck.Interface.Rest Extends %CSP.REST
{

Parameter HandleCorsRequest = "true";

XData UrlMap [ XMLNamespace = "http://www.systemCheck.com/urlmap" ]
{
<Routes>
  <Route Url="/widgets" Method="GET" Call="Widgets"/>
  <Route Url="/savewidgets" Method="POST" Call="SaveWidgets"/>

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
  
  Quit $$$OK
}

}

