import { LightningElement, wire } from "lwc";
import getOpportunityList from "@salesforce/apex/OpportunityController.getOpportunityList";
import getPriceBookName from "@salesforce/apex/OpportunityController.getPriceBookName";
import { publish, MessageContext } from "lightning/messageService";
import OPP_UPDATED_CHANNEL from "@salesforce/messageChannel/Opportunity_Update__c";

export default class SelectOpportunity extends LightningElement {
  current_value = "0067R00001uNVSIQA4";
  priceBook;
  opportunities = [];
  counter = 0;

  @wire(MessageContext)
  messageContext;

  @wire(getPriceBookName)
  setPriceBook(result) {
    if (result.data) {
      this.priceBook = result.data;
    } else {
      this.priceBook = " ";
    }
  }

  @wire(getOpportunityList)
  getOpportunities({ data, error }) {
    if (data) {
      let list = [];
      data.forEach((opp) => {
        let option = {};
        option.label = opp.Name;
        option.value = opp.Id;
        this.counter++;
        list.push(option);
      });
      this.opportunities = list;
      this.error = null;
      const payload = {
        oppid: this.current_value
      };
      publish(this.messageContext, OPP_UPDATED_CHANNEL, payload);
    } else if (error) {
      this.error = error;
      this.opportunities = [];
    }
  }

  handleChange(event) {
    this.current_value = event.detail.value;
    const payload = {
      oppid: this.current_value
    };
    publish(this.messageContext, OPP_UPDATED_CHANNEL, payload);
  }
}