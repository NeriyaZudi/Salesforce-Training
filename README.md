# Salesforce DX Project: Next Steps

Now that you’ve created a Salesforce DX project, what’s next? Here are some documentation resources to get you started.

## How Do You Plan to Deploy Your Changes?

Do you want to deploy a set of changes, or create a self-contained application? Choose a [development model](https://developer.salesforce.com/tools/vscode/en/user-guide/development-models).

## Configure Your Salesforce DX Project

The `sfdx-project.json` file contains useful configuration information for your project. See [Salesforce DX Project Configuration](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_ws_config.htm) in the _Salesforce DX Developer Guide_ for details about this file.

# Opportunity Products - Salesforce Traning <img src="https://img.shields.io/badge/version-1.0-yellowgreen" alt="version" >

<img src="https://raw.githubusercontent.com/NeriyaZudi/Salesforce-Training/main/project%20pictures/main%20opp%20product.jpg" align="center"
     alt="cover" width="600" height="400">
     
By: Neriya Zudi | <img src="https://img.shields.io/badge/Neriya-Salesforce Delevoper-blue" alt="Ner" > 

<h3> About the project </h3>
   <img src="https://raw.githubusercontent.com/NeriyaZudi/Salesforce-Training/main/project%20pictures/salesforce%20back.png" align="right"
     alt="SF logo" width="200" height="100">
     
     Salesforce learning project
     The project displays objects such as accounts, opportunities, opportunity products
     The product integrates Lwc components and is interactive for the user

 <img src="https://github.com/NeriyaZudi/Salesforce-Training/blob/main/project%20pictures/lightning-web-components-removebg-preview.png?raw=true" align="right"
     alt="LWC logo" width="320" height="98">
  <hr>
    
   In this project we demonstrate our knowledge in:
   * **Salesforce interface and features**
   * **Classes and APEX Triggers**
   * **LWC Components**
   * **LOTTIE Embedding animations**
   * **salesforce flow (send email action)**

# Some Pictures...
<h3> Main Page </h3>
          The main page contains 3 LWC components that communicate with each other:<br>
          Select opportunity - select an opportunity for presentation from opportunities related to the Price Book.<br>
          Product table - displaying product details related to the selected opportunity,<br>
          you can perform a search to filter results.<br>
          Cart account - display of products selected by account and possibility to purchase the products.<br>
 <img src="https://github.com/NeriyaZudi/Salesforce-Training/blob/main/project%20pictures/main%20page.png" align="center" 
      alt="main win"  width="800" height="400"><br>
  <h3> Add Products </h3>
       In this window, products selected to be added to the cart will be displayed.<br>
       You can continue by clicking the "Add products" button. <br>
 <img src="https://github.com/NeriyaZudi/Salesforce-Training/blob/main/project%20pictures/add%20to%20cart.png" align="center"
     alt="add" width="600" height="400"><br>
<h3> Empty Cart </h3>
       If no products have been added to the cart, a message will be displayed.<br>
       Also, if there is no account associated with the opportunity, you can add one by clicking the link.<br>
 <img src="https://github.com/NeriyaZudi/Salesforce-Training/blob/main/project%20pictures/empty%20cart.png" align="center"
     alt="empty" width="600" height="400"><br>
<h3> Receipt Email </h3>
       After making a purchase, a trigger is activated that updates the required objects.<br>
       And a flow is activated with the action of sending an email to the account with the purchase details.<br>
 <img src="https://github.com/NeriyaZudi/Salesforce-Training/blob/main/project%20pictures/email%20send.png" align="center"
     alt="email" width="600" height="400"><br>
