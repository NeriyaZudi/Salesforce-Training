import { track, LightningElement, wire } from "lwc";
import getOpportunityLineItemsList from "@salesforce/apex/ProductController.getOpportunityLineItemsList";
import updateOpportunity from "@salesforce/apex/OpportunityController.updateOpportunity";
import { subscribe, MessageContext } from "lightning/messageService";
import OPP_UPDATED_CHANNEL from "@salesforce/messageChannel/Opportunity_Update__c";

const columns = [
  {
    label: "Product Name",
    fieldName: "nameUrl",
    type: "url",
    typeAttributes: { label: { fieldName: "pName" }, target: "_blank" },
    cellAttributes: { class: { fieldName: "className" } }
  },
  { label: "Product Quantity", fieldName: "pQuantity" },
  { label: "Product Price", fieldName: "pPrice" },
  { label: "Product Total Price", fieldName: "pTotalPrice" }
];

export default class ProductTable extends LightningElement {
  error;
  noProducts = false;
  columns = columns;
  oppsItems = [];
  availableItems = [];
  selectedItems = [];
  isSelectProduct = false;
  isAddToCart = false;

  @track isShowModal = false;

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
    this.afterOppUpdate();
  }

  @wire(getOpportunityLineItemsList, { opportunity_id: "$opportunityId" })
  opportunitiesItems({ error, data }) {
    if (data) {
      let result = [];
      data.forEach((item) => {
        let oppItem = {};
        oppItem.nameUrl = `/${item.Id}`;
        oppItem.pName = item.Name;
        oppItem.pQuantity = item.Quantity;
        oppItem.pPrice = item.UnitPrice;
        oppItem.pTotalPrice = item.TotalPrice;
        oppItem.className = "filed-class";
        result.push(oppItem);
      });
      this.oppsItems = result;
      this.availableItems = this.oppsItems;
      this.error = null;
      this.noProducts = false;
    } else if (error) {
      this.error = error;
      this.oppsItems = [];
      this.availableItems = [];
    } else {
      this.noProducts = true;
    }
  }

  handleSearchProducts(event) {
    const searchKey = event.target.value.toLowerCase();

    if (searchKey) {
      this.availableItems = this.oppsItems;
      if (this.availableItems) {
        let searchResult = [];
        for (let res of this.availableItems) {
          let values = Object.values(res);
          for (let val of values) {
            let stringValue = String(val);
            if (stringValue) {
              if (stringValue.toLowerCase().includes(searchKey)) {
                searchResult.push(res);
                break;
              }
            }
          }
        }
        this.availableItems = searchResult;
        // console.log("res" + this.availableItems);
      }
    } else {
      this.availableItems = this.oppsItems;
    }
  }
  connectedCallback() {
    this.subscribeToMessageChannel();
  }
  afterOppUpdate() {
    getOpportunityLineItemsList({ opportunity_id: "$opportunityId" })
      .then((result) => {
        console.log(result);
        // eslint-disable-next-line no-undef
        refreshApex(this.availableItems);
      })
      .catch((error) => {
        this.error = error;
      });
  }
  getSelectedProducts() {
    var selectedProducts = this.template
      .querySelector("lightning-datatable")
      .getSelectedRows();
    this.selectedItems = [];
    if (selectedProducts.length > 0) {
      let products = [];
      selectedProducts.forEach((currentItem) => {
        let p = {};
        let idFix = currentItem.nameUrl.slice(1);
        p.Id = idFix;
        p.pName = currentItem.pName;
        p.quantity = currentItem.pQuantity;
        p.price = currentItem.pPrice;
        products.push(p);
      });
      // console.log("selected products are ", products);
      this.selectedItems = products;
      this.isSelectProduct = true;
    } else {
      this.isSelectProduct = false;
    }
    this.showModalBox();
  }

  showModalBox() {
    this.isShowModal = true;
  }

  hideModalBox() {
    this.isShowModal = false;
  }
  handleAddToCart() {
    updateOpportunity({
      oppId: this.opportunityId,
      selectedProducts: this.selectedItems
    })
      .then((res) => {
        console.log(res, "res");
        this.isAddToCart = true;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
          this.hideModalBox();
          this.refreshComponent();
        }, 5000);
      })
      .catch((err) => {
        console.log(err.body.message, "error");
      });
  }
  refreshComponent() {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      // eslint-disable-next-line no-eval
      eval("$A.get('e.force:refreshView').fire();");
    }, 1000);
  }
}
