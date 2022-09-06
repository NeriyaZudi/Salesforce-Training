import { LightningElement, wire, track } from "lwc";
import getAccountBillProducts from "@salesforce/apex/AccountBillController.getAccountBillProducts";
import purchaseProduct from "@salesforce/apex/AccountBillController.purchaseProduct";
import { subscribe, MessageContext } from "lightning/messageService";
import OPP_UPDATED_CHANNEL from "@salesforce/messageChannel/Opportunity_Update__c";

export default class AccountBill extends LightningElement {
  error;
  products = [];
  count = 0;
  total = 0;
  isGetProducts = false;
  noAccountBill = false;
  displayCart = false;
  OppUrl = "";
  @track opportunityId;
  @wire(MessageContext)
  messageContext;

  subscribeToMessageChannel() {
    this.subscription = subscribe(
      this.messageContext,
      OPP_UPDATED_CHANNEL,
      (message) => this.handleMessage(message)
    );
  }
  handleMessage(message) {
    this.opportunityId = message.oppid;
    this.afterAccountUpdate();
  }

  @wire(getAccountBillProducts, { opp_id: "$opportunityId" })
  AccountBillProducts({ data, error }) {
    this.total = 0;
    if (data) {
      let result = [];
      let count = 0;
      this.products = [];
      this.noAccountBill = false;
      data.forEach((product) => {
        let p = {};
        p.nameUrl = `/${product.Id}`;
        p.pName = product.Product_Name__c;
        p.quantity = product.Product_Quantity__c;
        p.price = product.Product_Price__c;
        count = count + p.quantity * p.price;
        result.push(p);
      });
      this.products = result;
      this.total = count;
      // console.log("total sum", this.total);
      if (!this.noAccountBill && !this.isGetProducts) {
        this.displayCart = true;
        this.noAccountBill = false;
      }
      this.error = undefined;
    } else if (error) {
      this.error = error;
    } else {
      this.noAccountBill = true;
      this.displayCart = false;
      this.total = 0;
      this.OppUrl = `/${this.opportunityId}`;
      console.log("ERR here");
    }
  }
  afterAccountUpdate() {
    getAccountBillProducts({ opp_id: "$opportunityId" })
      .then((result) => {
        console.log(result);
        console.log("succsess");

        // eslint-disable-next-line no-undef
        refreshApex(this.products);
      })
      .catch((error) => {
        this.error = error;
      });
  }
  connectedCallback() {
    this.subscribeToMessageChannel();
  }
  getProducts() {
    this.displayCart = false;
    this.isGetProducts = true;
    console.log(
      "start with opp ",
      this.opportunityId,
      "and amount ",
      this.total
    );

    purchaseProduct({ opp_id: this.opportunityId, amount: this.total })
      .then((result) => {
        console.log("purchase", result);
      })
      .catch((error) => {
        this.error = error;
        console.log("error in purches");
      });
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.isGetProducts = false;
      this.displayCart = true;
      this.afterAccountUpdate();
    }, 7000);
  }
}
