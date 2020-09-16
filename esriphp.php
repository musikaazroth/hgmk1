<?php
$GLOBALS['helparr'] = array(
  "f"=>"json",
  "token"=>"token",
  "where"=>"1=1",
  "objectIds"=>"1,2,3",
  "geometry"=>array("{rings[[[xy],[xy1],[xyn],[xy]]]}","{x:x,y:y}","{minx:x1,miny:y1,maxx:x2,maxy:y2}"),
  "geometryType"=>array("esriGeometryPoint","esriGeometryMultipoint","esriGeometryPolyline","esriGeometryPolygon","esriGeometryEnvelope"),
  "inSR"=>"{wkid:4326,latestWkid:4326}",
  "spatialRel"=>array("esriSpatialRelIntersects","esriSpatialRelContains","esriSpatialRelCrosses","esriSpatialRelEnvelopeIntersects","esriSpatialRelIndexIntersects","esriSpatialRelOverlaps","esriSpatialRelTouches","esriSpatialRelWithin"),
  "relationParam"=>array("interiorXinterior","interiorXboundary","interiorXexterior","boundaryXinterior","...","exteriorXexterior"),
  "time"=>array("null","epoch"),
  "distance"=>"100 in meter",
  "units"=>array("esriSRUnit_Meter","esriSRUnit_StatuteMile","esriSRUnit_Foot","esriSRUnit_Kilometer","esriSRUnit_NauticalMile","esriSRUnit_USNauticalMile"),
  "outFields"=>"*",
  "returnGeometry"=>"Boolean",
  "maxAllowableOffset"=>"Simplification in Integer",
  "geometryPrecision"=>"Integer",
  "outSR"=>"{wkid:4326,latestWkid:4326}",
  "havingClause"=>"whereClause in SQL for Statistic ex. Count(field) > n",
  "returnDistinctValues"=>"Boolean",
  "returnIdsOnly"=>"Boolean",
  "returnCountOnly"=>"Boolean",
  "returnExtentOnly"=>"Boolean",
  "returnCentroid"=>"Boolean",
  "returnExceededLimitFeatures"=>"Boolean",
  "orderByFields"=>"field",
  "groupByFieldsForStatistics"=>"field",
  "outStatistics"=>"[{statisticType,onStatisticField,outStatisticFieldName}]",
  "resultOffset"=>"LIMIT THIS,resultRecordCount",
  "resultRecordCount"=>"LIMIT resultOffset,THIS"
);
$GLOBALS['inRadius'] = array();
class createEsriPHP {
  public function postdata($data,$printResult=false){
    if(gettype($data)!='array'||empty($data)||sizeof($data)<2){
      return false;
    }
    if(!isset($data['url'])||gettype($data['url'])!='string'||empty($data['url'])){
      return false;
    }
    $dataarr = array();
    foreach($data as $k=>$v){
      if($k!='url'){
        $dataarr[$k] = $v;
      }
    }
    $url = $data['url'];
    $ch = curl_init($url);
    $postString = http_build_query($dataarr, '', '&');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postString);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $r = curl_exec($ch);
    //ss
    curl_close($ch);
    $r = json_decode($r,true);
    if(is_null($r)||empty($r)){
      $r = false;
    }
    if($printResult){
      call_user_func(array($this,'console'),$r);
    }
    return $r;
  }
  public function getdata($data,$printResult=false){
    if(gettype($data)!='array'||empty($data)||sizeof($data)<2){
      return false;
    }
    if(!isset($data['url'])||gettype($data['url'])!='string'||empty($data['url'])){
      return false;
    }
    $dataarr = "";
    foreach($data as $k=>$v){
      if($k!='url'){
        if(!empty($dataarr)){
          $dataarr .= "&";
        }else{
          $dataarr .= "?";
        }
        $dataarr .= $k."=".$v;
      }
    }
    $url = $data['url'];
    $pathdata = $url.$dataarr;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HEADER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
    curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_URL, $pathdata);
    $r = curl_exec($ch);
    curl_close($ch);
    $r = json_decode($r,true);
    if(is_null($r)||empty($r)){
      $r = false;
    }
    if($printResult){
      call_user_func(array($this,'console'),$r);
    }
    return $r;
  }
  public function console($str){
    echo "<script>console.log(".json_encode($str).")</script>";
  }
  public function echohelp(){
    echo json_encode($GLOBALS['helparr']);
  }
  public function consolehelp(){
    echo "<script>console.log(".json_encode($GLOBALS['helparr']).")</script>";
  }
  public function checkparam($method,$retmethod,$data){
    $resultarr = array();
    foreach($data as $k=>$v){
      if($method=='GET'){
        if(!isset($_GET[$v])||(empty($_GET[$v])&&strpos(json_encode($_GET['b']),"0")===false)||is_null($_GET[$v])){
          array_push($resultarr,false);
        }else{
          array_push($resultarr,true);
        }
      }
      if($method=='POST'){
        if(!isset($_POST[$v])||(empty($_POST[$v])&&strpos(json_encode($_POST['b']),"0")===false)||is_null($_POST[$v])){
          array_push($resultarr,false);
        }else{
          array_push($resultarr,true);
        }
      }
    }
    $result = true;
    foreach($resultarr as $k=>$v){
      if($k==0){
        $result = $v;
      }
      $result = $result&&$v;
    }
    if(!$result){
      if($retmethod=='echo'){
        echo json_encode("Insufficient Param(s)");
      }
      if($retmethod=='console'){
        call_user_func(array($this,'console'),"Insufficient Param(s)");
      }
      exit();
    }
    return $result;
  }
  public function inDatabase($token,$lurl,$fid,$ido){
    $urlarr = array_reverse(explode("/",$lurl));
    if(is_numeric($urlarr[0])){
      $lurl .= "/query";
    }
    $where = "";
    if(gettype($ido)!='array'){
      $ido = array($ido);
    }
    foreach($ido as $k=>$v){
      $where .= $fid.' = '.$v;
      if($k<(sizeof($ido)-1)){
        $where .= " OR ";
      }
    }
    $parse = array(
      'url'=>$lurl,
      'f'=>'json',
      'where'=>$where,
      'returnIdsOnly'=>"true",
      'returnGeometry'=>"false"
    );
    if($token!="*"){
      $parse['token'] = $token;
    }
    $r = call_user_func(array($this,'postdata'),$parse);
    $retattr = false;
    if(isset($r['objectIds'])){
      $retattr = $r['objectIds'];
    }
    return $retattr;
  }
  public function createvector($token,$lurl,$fid,$features){
    $urlarr = array_reverse(explode("/",$lurl));
    $Curl = "";
    $Eurl = "";
    if(is_numeric($urlarr[0])){
      $Curl = $lurl."/addFeatures";
      $Eurl = $lurl."/query";
    }
    $featuresR = array();
    $featuresE = array();
    if(isset($features['attributes'])){
      $features = array($features);
    }
    foreach($features as $k=>$v){
      $fE = call_user_func(array($this,'inDatabase'),$token,$lurl,$fid,$v['attributes'][$fid]);
      if(!empty($fE)){
        $fidE = call_user_func(array($this,'getField'),$token,$lurl);
        $vtmp = $v;
        $vtmp['attributes'][$fidE] = $fE[0];
        array_push($featuresE,$vtmp);
      }else{
        array_push($featuresR,$v);
      }
    }
    $result = false;
    if(!empty($featuresE)){
      if(!$result){
        $result = array();
      }
      foreach($featuresE as $k=>$v){
        $r = call_user_func(array($this,'editvector'),$token,$lurl,$fid,$v);
        foreach($r as $ky=>$vl){
          array_push($result,$vl);
        }
      }
    }
    if(!empty($featuresR)){
      if(!$result){
        $result = array();
      }
      $parse = array(
        'url'=>$Curl,
        'f'=>'json',
        'features'=>json_encode($featuresR),
        'returnEditMoment'=>"true",
        'rollbackOnFailure'=>"true"
      );
      if($token!="*"){
        $parse['token'] = $token;
      }
      $r = call_user_func(array($this,'postdata'),$parse);
      foreach($r['addResults'] as $k=>$v){
        array_push($result,$v);
      }
    }
    return $result;
  }
  public function deletevector($token,$lurl,$fiq,$idq){
    $urlarr = array_reverse(explode("/",$lurl));
    $Eurl = "";
    $Durl = "";
    if(is_numeric($urlarr[0])){
      $Eurl = $lurl."/query";
      $Durl = $lurl."/deleteFeatures";
    }
    if(gettype($idq)!='array'){
      $idq = array($idq);
    }
    $idsR = "";
    $rExist = call_user_func(array($this,'inDatabase'),$token,$Eurl,$fiq,$idq);
    foreach($rExist as $k=>$v){
      $idsR .= $v;
      if($k<(sizeof($rExist)-1)){
        $idsR .= ",";
      }
    }
    $parse = array(
      'url'=>$Durl,
      'f'=>'json',
      'objectIds'=>$idsR,
      'returnEditMoment'=>"true",
      'rollbackOnFailure'=>"true",
      'returnDeleteResults'=>"true"
    );
    if($token!="*"){
      $parse['token'] = $token;
    }
    $r = call_user_func(array($this,'postdata'),$parse);
    if(isset($r['deleteResults'])){
      return $r['deleteResults'];
    }else{
      return false;
    }
  }
  public function editvector($token,$lurl,$fid,$features){
    $urlarr = array_reverse(explode("/",$lurl));
    $Aurl = "";
    $lyr = null;
    if(is_numeric($urlarr[0])){
      $lyr = $urlarr[0];
      $Aurl = array_reverse($urlarr);
      $Aurlpop = array_pop($Aurl);
      $Aurl = join("/",$Aurl)."/applyEdits";
    }
    if(isset($features['attributes'])){
      $features = array($features);
    }
    $goProc = true;
    $featuresR = array(array("id"=>$lyr,"updates"=>array()));
    $readfield = false;
    $fidR = '';
    foreach($features as $k=>$v){
      $rF = false;
      $rD = false;
      if(!$readfield){
        $rF = call_user_func(array($this,"getField"),$token,$lurl,true);
        $fidR = $rF;
        $readfield = true;
      }else{
        $rF = $fidR;
      }
      if(!isset($features[$k]['attributes'][$rF])||empty($features[$k]['attributes'][$rF])){
        $rD = call_user_func(array($this,"inDatabase"),$token,$lurl,$fid,$v['attributes'][$fid]);
      }else{
        $rD = array($features[$k]['attributes'][$rF]);
      }
      if($rD&&$rF){
        $features[$k]['attributes'][$rF] = $rD[0];
        array_push($featuresR[0]['updates'],$features[$k]);
      }else{
        $goProc = false;
      }
    }
    $parse = array(
      'url'=>$Aurl,
      'f'=>'json',
      'edits'=>json_encode($featuresR),
      'returnEditMoment'=>"true",
      'rollbackOnFailure'=>"true"
    );
    if($token!="*"){
      $parse['token'] = $token;
    }
    if($goProc){
      $r = call_user_func(array($this,'postdata'),$parse);
      if(isset($r[0]['updateResults'])){
        return $r[0]['updateResults'];
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
  public function getField($token,$lurl,$fid=false){
    $parse = array(
      'url'=>$lurl,
      'f'=>'json',
    );
    if($token!="*"){
      $parse['token'] = $token;
    }
    $r = call_user_func(array($this,'postdata'),$parse);
    $result = false;
    if($r&&isset($r['fields'])){
      if($fid){
        foreach($r['fields'] as $k=>$v){
          if($v['type']=="esriFieldTypeOID"&&!$result){
            $result = $v['name'];
          }
        }
      }else{
        $result = $r['fields'];
      }
    }
    return $result;
  }
  public function inRadius($token,$lurl,$loc,$rad,$geom,$o=0){
    $urlarr = array_reverse(explode("/",$lurl));
    if(is_numeric($urlarr[0])){
      $lurl .= "/query";
    }
    $parse = array(
      'url'=>$lurl,
      'f'=>'json',
      'geometry'=>json_encode($loc),
      'geometryType'=>"esriGeometryPoint",
      'outFields'=>"*",
      'inSR'=>"{wkid:4326,latestWkid:4326}",
      'outSR'=>"{wkid:4326,latestWkid:4326}",
      'returnGeometry'=>json_encode($geom),
      'distance'=>$rad,
      'resultOffset'=>$o,
      'resultRecordCount'=>"2000"
    );
    if($token!="*"){
      $parse['token'] = $token;
    }
    $result = array();
    $r = call_user_func(array($this,'postdata'),$parse);
    if($r&&isset($r['features'])){
      foreach($r['features'] as $k=>$v){
        array_push($result,$v);
      }
      if($r['exceededTransferLimit']){
        $rI = call_user_func(array($this,'inRadius'),$token,$lurl,$loc,$rad,($o+2000));
        foreach($rI as $k=>$v){
          array_push($result,$v);
        }
      }
    }
    return $result;
  }
  public function identify($token,$lurlarr,$loc,$rad,$geom){
    $result = array();
    if(gettype($lurlarr)!='array'){
      $lurlarr = array($lurlarr);
    }
    foreach($lurlarr as $k=>$v){
      $lurl = $v;
      $tmp = array("url"=>$lurl,"data"=>array());
      $urlarr = array_reverse(explode("/",$lurl));
      $r = call_user_func(array($this,'inRadius'),$token,$lurl,$loc,$rad,$geom);
      if($r!==false){
        foreach($r as $ky=>$vl){
          array_push($tmp['data'],$vl);
        }
      }
      array_push($result,$tmp);
    }
    return $result;
  }
  public function readData($token,$lurl,$option=null){
    if(is_null($option)){
      $option = array(
        "returnGeometry"=>"false",
        "resultOffset"=>0,
        "resultRecordCount"=>2000
      );
    }
    $urlarr = array_reverse(explode("/",$lurl));
    if(is_numeric($urlarr[0])){
      $lurl .= "/query";
    }
    $parse = array(
      'url'=>$lurl,
      'f'=>'json',
      'outFields'=>"*",
      'inSR'=>"{wkid:4326,latestWkid:4326}",
      'outSR'=>"{wkid:4326,latestWkid:4326}",
    );
    if($token!="*"){
      $parse['token'] = $token;
    }
    foreach($option as $k=>$v){
      if($v||$v===0){
        $parse[$k] = $v;
      }else{
        unset($parse[$k]);
      }
    }
    $r = call_user_func(array($this,'postdata'),$parse);
    if(isset($r['exceededTransferLimit'])&&$r['exceededTransferLimit']==true){
      $option['resultOffset'] += 2000;
      $option['resultRecordCount'] = 2000;
      $resarr = call_user_func(array($this,'readData'),$token,$lurl,$option);
      foreach((($resarr)['features']) as $ky=>$vl){
        array_push($r['features'],$vl);
      }
    }
    return $r;
  }
}
?>
