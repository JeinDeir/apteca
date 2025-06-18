<?php

if (!isset($_SERVER['HTTP_REFERER']) {
    header("Location: /index.php");
    exit;
}
?>