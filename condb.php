<?php
class createCon  {
	private $host = "localhost";
	private $user = "";
	private $password = "";

	private $database = "";


	private $myconn;
	private $afrow = 0;
	private $lastid = 0;
	private $rowcount = 0;

	function __construct() {
		$con = mysqli_connect($this->host, $this->user, $this->password, $this->database);
		if (!$con) {
			die('Could not connect to database!');
		} else {
			$this->myconn = $con;
		}
		return $con;
	}

	function updatePassword($uname, $pass) {
		mysqli_begin_transaction($this->myconn);

		$result1 = $this->myconn->prepare("UPDATE tblogin SET pass1 = ? WHERE username = '$uname'");
		$result1->bind_param("s", $pass);
		$result1->execute();

		if ($result1) {
			mysqli_commit($this->myconn);
			return true;
		} else {
			mysqli_rollback($this->myconn);
			return false;
		}
	}

	function getSql($query) {
		$resultset = array();

		mysqli_begin_transaction($this->myconn);
		$result = mysqli_query($this->myconn, $query);
		if (!empty($result))
			$this->rowcount = mysqli_num_rows($result);
		else
			$this->rowcount = 0;

		if ($result) {
			mysqli_commit($this->myconn);
			if (!empty($result)) {
				while($row=mysqli_fetch_assoc($result)) {
					$resultset[] = $row;
				}
				return $resultset;
			} else {
				return false;
			}
		} else {
			mysqli_rollback($this->myconn);
			return false;
		}
	}

	function _escapetxt($txt) {
		$txt = $this -> sanitize($txt, 0);
		return mysqli_escape_string($this->myconn, $txt);
	}

	function runSqls($qr, $lastid = false, $debug = false) {
		mysqli_begin_transaction($this->myconn);
		$query = array();
		$er = false;

		if (!is_array($qr)) array_push($query, $qr);
		else $query = $qr;

		$this->afrow = 0;
		foreach ($query as $v) {
			$result = mysqli_query($this->myconn, $v);
			$this->afrow += mysqli_affected_rows($this->myconn);
			$this->lastid = mysqli_insert_id($this->myconn);

			if (!$result) {
				$er = true; break;
			}
		}

		if (!$er) {
			if (!$debug) {
				mysqli_commit($this->myconn);
			} else {
				mysqli_rollback($this->myconn);
			}
			if ($lastid) {
				return array("status" => true, "lastid" => $this->lastid);
			} else {
				return true;
			}
		} else {
			mysqli_rollback($this->myconn);
			if ($lastid) {
				return array("status" => false);
			} else {
				return false;
			}
		}
	}

	function close() {
			mysqli_close($this->myconn);
	}


	function sanitize($data = NULL, $depth = 0) {

		//Prevent the function from being run more than once without specific input.
		global $sanitized;
		if ($data === NULL and $depth == 0) {
			if ($sanitized) {
				return;
			}
			else {
				$GLOBALS['sanitized'] = True;
			}
		}

		if ($depth < 0 or !is_int($depth)) {
			$depth = 0;
		}
		// Increment the depth
		$depth = $depth + 1;

		//Prevent infinite recursion in case something goes wrong.
		if ($depth > 10) {
			return NULL;
		}

		//If no data parameter is given, then sanitize all possible user input.
		if ($data === NULL and $depth == 1) {
			if (isset($_GET)) {
				$_GET = sanitize($_GET, $depth);
			}
			if (isset($_POST)) {
				$_POST = sanitize($_POST, $depth);
			}
			if (isset($_COOKIE)) {
				$_COOKIE = sanitize($_COOKIE, $depth);
			}
			if (isset($_REQUEST)) {
				$_REQUEST = sanitize($_REQUEST, $depth);
			}
			if (isset($_FILES)) {
				$_FILES = sanitize($_FILES, $depth);
			}
		}

		$type = gettype($data);
		$output = NULL;
		if ($type === "boolean" and is_bool($data)) {
			if ($data) {
				$data = True;
			}
			else {
				$data = False;
			}
			$output = (bool)$data;
		}
		else if ($type === "integer" and is_int($data) and is_numeric($data)) {
			$data = intval($data);
			$data = filter_var($data, FILTER_SANITIZE_NUMBER_INT);
			$output = (int)$data;
		}
		else if ($type === "double" and is_float($data) and is_numeric($data)) {
			$data = filter_var($data, FILTER_SANITIZE_NUMBER_FLOAT);
			$output = (double)$data;
		}
		else if ($type === "string") {
			$data = trim($data);
			if (filter_var($data, FILTER_VALIDATE_EMAIL)) {
				// If $data is an email, leave it alone.
			}
			else {
				$data = stripslashes($data);
				$data = strip_tags($data);
				$data = htmlspecialchars($data);
				$data = filter_var($data, FILTER_SANITIZE_STRING);
				$data = addslashes($data);
			}
			$output = (string)$data;
		}
		else if ($type === "array" and is_array($data)) {
			foreach ($data as $key => $value) {
			   $data[$key] = sanitize($value, $depth);
			}
			$output = (array)$data;
		}
		else if ($type === "object" and is_object($data)) {
			foreach ($data as $key => $value) {
			   $data[$key] = sanitize($value, $depth);
			}
			$output = (object)$data;
		}
		else if ($type === "resource" and is_resource($data)) {
		}
		else if ($type === "NULL" and is_null($data)) {
		}
		else if ($type === "unknown type") {
		}
		return $output;
	}


}
?>
