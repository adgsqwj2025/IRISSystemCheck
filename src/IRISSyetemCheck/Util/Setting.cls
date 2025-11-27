Class IRISSyetemCheck.Util.Setting
{

Parameter HandleCorsRequest = "true";

ClassMethod initialization() As %Status
{

	set ns=$namespace
	Do $SYSTEM.OBJ.Export("IRISSyetemCheck.Interface.Rest.cls",$SYSTEM.Util.InstallDirectory()_"systemcheck.xml")
	Do $system.OBJ.ImportDir("/opt/IRISSystemCheck/user/",,"cbrpsuy",,1)

 
	zn "%SYS"
	set temp={"widgets":[{"id":"widget_1764129069307_2my29quxt","title":"LargePagesEnabled","type":"data","apiUrl":"http://localhost:52773/api/SystemCheck/LargePagesEnabled","apiMethod":"GET","apiHeaders":"","apiBody":"","refreshInterval":0,"enabled":true,"createdAt":"2025-11-26T03:51:09.307Z"},{"id":"widget_1764129217300_amd75jtsc","title":"ProcessMemory","type":"data","apiUrl":"http://localhost:52773/api/SystemCheck/ProcessMemory","apiMethod":"GET","apiHeaders":"","apiBody":"","refreshInterval":0,"enabled":true,"createdAt":"2025-11-26T03:53:37.301Z"},{"id":"widget_1764129319496_zwdz3cw4s","title":"VirtualIP","type":"data","apiUrl":"http://localhost:52773/api/SystemCheck/VirtualIP","apiMethod":"GET","apiHeaders":"","apiBody":"","refreshInterval":0,"enabled":true,"createdAt":"2025-11-26T03:55:19.496Z"},{"id":"widget_1764129434034_bvusdsv2j","title":"MirrorDatabase","type":"data","apiUrl":"http://localhost:52773/api/SystemCheck/MirrorDatabase","apiMethod":"GET","apiHeaders":"","apiBody":"","refreshInterval":0,"enabled":true,"createdAt":"2025-11-26T03:57:14.034Z"},{"id":"widget_1764129444544_o9v15ketu","title":"GlobalBuffer","type":"data","apiUrl":"http://localhost:52773/api/SystemCheck/GlobalBuffer","apiMethod":"GET","apiHeaders":"","apiBody":"","refreshInterval":0,"enabled":true,"createdAt":"2025-11-26T03:57:24.544Z"}]}
	set ^widgtconfig=temp.%ToJSON()
	D $system.OBJ.Load($SYSTEM.Util.InstallDirectory()_"systemcheck.xml","cbrpsuy")
	Set sc("DispatchClass")="IRISSyetemCheck.Interface.Rest",sc("AutheEnabled")=64,sc("IsNameSpaceDefault")=0,sc("MatchRoles")=":%All",sc("GroupById")="%ISCMgtPortal",sc("NameSpace")="%SYS",sc("DeepSeeEnabled")=1
	Set tSC=##Class(Security.Applications).Create("/api/SystemCheck",.sc)
	zn ns
	
	
 Quit $$$OK
}

}
