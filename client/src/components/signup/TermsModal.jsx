import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight:"90%",
  overflow:"auto"
};

export default function TermsModal({ children }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant="text" onClick={handleOpen}>
        {children}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          Terms and Conditions
          </Typography>
          

<Typography mt={1} paragraph>Welcome to WebWeave, a social media platform that connects users from around the world. By using our website, you agree to comply with these terms and conditions, which govern your use of the website. If you do not agree to these terms and conditions, you should not use the website.</Typography>

<Typography paragraph>1. User Accounts</Typography>

<Typography paragraph>To access certain features of the website, you may be required to create an account. You must provide accurate and complete information when creating your account. You are solely responsible for maintaining the confidentiality of your account and password, and you agree to accept responsibility for all activities that occur under your account.</Typography>

<Typography paragraph>2. User Content</Typography>

<Typography paragraph>You are solely responsible for any content, messages, or other information that you upload, publish, or display on the website. By submitting content to the website, you grant us a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media.</Typography>

<Typography paragraph>3. Security</Typography>

<Typography paragraph>I take reasonable measures to protect the security of your personal information and data, but I cannot guarantee that unauthorized third parties will not be able to circumvent my security measures. You acknowledge that you provide your personal information and use the website at your own risk.</Typography>

<Typography paragraph>4. Prohibited Conduct</Typography>

<Typography paragraph>You agree not to use the website for any purpose that is prohibited by these terms and conditions. Prohibited conduct includes, but is not limited to, the following:</Typography>

<ul>
  <li>Engaging in any activity that violates any applicable law or regulation;</li>
  <li>Using the website to impersonate any person or entity, or falsely stating or otherwise misrepresenting your affiliation with a person or entity;</li>
  <li>Uploading, publishing, or displaying any content that is defamatory, obscene, pornographic, or otherwise offensive;</li>
  <li>Using the website to send unsolicited commercial messages, spam, or other unauthorized communications;</li>
  <li>Attempting to interfere with, compromise the security of, or disrupt the operation of the website.</li>
</ul>

<Typography paragraph>5. Intellectual Property</Typography>

<Typography paragraph>The website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof), are owned by Ibrahim Gaber, and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</Typography>

<Typography paragraph>6. Disclaimer of Warranties</Typography>

<Typography paragraph>The website and its contents are provided "as is" and "as available" without warranty of any kind, either express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, non-infringement, and freedom from computer viruses or other harmful components.</Typography>

<Typography paragraph>7. Limitation of Liability</Typography>

<Typography paragraph>In no event shall Ibrahim Gaber or WebWeave be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the website.</Typography>

<Typography paragraph>8. Indemnification</Typography>

<Typography paragraph>You agree to indemnify, defend, and hold harmless Ibrahim Gaber and WebWeave, and its affiliates, officers, directors, employees, agents, licensors, and suppliers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these terms.</Typography>

        </Box>
      </Modal>
    </div>
  );
}
