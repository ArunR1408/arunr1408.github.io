<?php
  // Replace with your actual receiving email address
  $receiving_email_address = 'arun1892003@gmail.com';

  // Ensure the PHP Email Form library is included correctly
  if (file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php')) {
    include($php_email_form);
  } else {
    die('Error: Unable to load the "PHP Email Form" Library!');
  }

  $contact = new PHP_Email_Form;
  $contact->ajax = true; // Enable AJAX

  // Set the receiving email address
  $contact->to = $receiving_email_address;

  // Collect form data
  $contact->from_name = isset($_POST['name']) ? strip_tags($_POST['name']) : 'Unknown';
  $contact->from_email = isset($_POST['email']) ? strip_tags($_POST['email']) : 'no-reply@example.com';
  $contact->subject = isset($_POST['subject']) ? strip_tags($_POST['subject']) : 'Contact Form Submission';

  // Add form messages
  $contact->add_message($contact->from_name, 'From');
  $contact->add_message($contact->from_email, 'Email');
  $contact->add_message(isset($_POST['message']) ? strip_tags($_POST['message']) : 'No message', 'Message', 10);

  // Optional: Configure SMTP if needed
  /*
  $contact->smtp = array(
    'host' => 'smtp.example.com',
    'username' => 'your_username',
    'password' => 'your_password',
    'port' => '587'
  );
  */

  // Send the email and output the result
  echo $contact->send();
?>
