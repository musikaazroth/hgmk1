<?php
class createDfcb {
  function postdata($data,$printResult=false){
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
  public function createResult(){
    $result = array("data"=>array(),"error"=>array("code"=>1,"msg"=>"Access Denied"));
    return $result;
  }
  public function checkparam($method,$data,$retmethod=null){
    $resultarr = array();
    foreach($data as $k=>$v){
      if($method=='GET'){
        if(!isset($_GET[$v])||(empty($_GET[$v])&&strpos(json_encode($_GET[$v]),"0")===false)||is_null($_GET[$v])){
          array_push($resultarr,false);
        }else{
          array_push($resultarr,true);
        }
      }
      if($method=='POST'){
        if(!isset($_POST[$v])||(empty($_POST[$v])&&strpos(json_encode($_POST[$v]),"0")===false)||is_null($_POST[$v])){
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
    return $result;
  }
  public function _escapehtml($str){
    $result = preg_replace('#<[^>]+>#', '', $str);
    return $result;
  }
  public function cekcc($db,$api,$ltc){
    $result = false;
    $paramget = json_encode($_GET);
    $parampost = json_encode($_POST);
    $apidate = date("Y-m-d H:i:s",strtotime(date("Y-m-d H:i:s")." -$ltc seconds"));
    $dbdata = $db->getSql("SELECT result FROM APIresult WHERE api = '$api' AND paramget = '$paramget' AND parampost = '$parampost' AND ts>'$apidate'");
    if(isset($dbdata[0])){
      $result = json_decode($dbdata[0]['result'],0);
    }
    return $result;
  }
  public function makecc($db,$api,$apiR){
    $apiR = $db->_escapetxt(json_encode($apiR));
    $paramget = json_encode($_GET);
    $parampost = json_encode($_POST);
    $apidatenow = date("Y-m-d H:i:s");
    $apilogsql = "INSERT IGNORE INTO APIresult (api,paramget,parampost,result,ts) VALUES ('$api','$paramget','$parampost','$apiR','$apidatenow') ON DUPLICATE KEY UPDATE result='$apiR', ts = '$apidatenow'";
    $apilog = $db->runSqls($apilogsql);
    $tmp = array($apilog,$apilogsql);
    return $tmp;
  }
  public function random_color_part() {
		return str_pad( dechex( mt_rand( 0, 255 ) ), 2, '0', STR_PAD_LEFT);
	}
	public function random_color() {
		return '#'.call_user_func(array($this,'random_color_part'),null) . call_user_func(array($this,'random_color_part'),null) . call_user_func(array($this,'random_color_part'),null);
	}
  public function genFilter($table,$fieldarr,$group){
    $fields = '';
    $whr = '';
    if($fieldarr){
      $fields = " IF(".$fieldarr[0]." IS NULL OR ".$fieldarr[0]." = '',0,".$fieldarr[0].") AS filterKey, IF(".$fieldarr[1]." IS NULL OR ".$fieldarr[1]." = '','Lainnya',".$fieldarr[1].") AS filterTxt ";
    }
    $res = array("fields"=>$fields,"sql"=>"SELECT $fields FROM $table GROUP BY $group");
    return $res;
  }
}
 ?>
