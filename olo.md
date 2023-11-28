
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'http://localhost:8080/api/actualizar_facial',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'{
  "email": "saidinfo4545@gmail.com",
  "nuevoBase64String": ""
}',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/json',
    'Cookie: connect.sid=s%3A-rgVCGU5M0d1_y7k8khe6sEp0nsGcgj6.236xve0LEO7vh7t4nJwJlGcHqJmKgaQar9ZLocNF%2FX8'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
