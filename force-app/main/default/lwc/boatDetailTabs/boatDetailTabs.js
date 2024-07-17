import { wire, LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";

import { getRecord, getFieldValue } from "lightning/uiRecordApi";

// Custom Labels Imports
import labelDetails from "@salesforce/label/c.Details";
import labelReviews from "@salesforce/label/c.Reviews";
import labelAddReview from "@salesforce/label/c.Add_Review";
import labelFullDetails from "@salesforce/label/c.Full_Details";
import labelPleaseSelectABoat from "@salesforce/label/c.Please_select_a_boat";
// Boat__c Schema Imports
import BOAT_ID_FIELD from "@salesforce/schema/Boat__c.Id";
import BOAT_NAME_FIELD from "@salesforce/schema/Boat__c.Name";
// import BOATMC from the message channel
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";
import {
  subscribe,
  APPLICATION_SCOPE,
  MessageContext,
  unsubscribe
} from "lightning/messageService";

const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
  @wire(MessageContext)
  messageContext;
  boatId;

  @wire(getRecord, { recordId: "$boatId", fields: BOAT_FIELDS })
  wiredRecord;
  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat
  };

  // Decide when to show or hide the icon
  // returns 'utility:anchor' or null
  get detailsTabIconName() {
    return this.wiredRecord.data ? "utility:anchor" : null;
  }

  // Utilize getFieldValue to extract the boat name from the record wire
  get boatName() {
    return getFieldValue(this.wiredRecord, BOAT_NAME_FIELD);
  }

  // Private
  subscription = null;

  // Subscribe to the message channel
  subscribeMC() {
    // local boatId must receive the recordId from the message
    if (this.subscription) {
      return;
    }
    this.subscription = subscribe(
      this.messageContext,
      BOATMC,
      (message) => {
        this.boatId = message.recordId;
      },
      { scope: APPLICATION_SCOPE }
    );
  }

  // Unsubscribing to message  channel

  unsubscribeFromMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  // Calls subscribeMC()
  connectedCallback() {
    this.subscribeMC();
  }
  // calls Unsubscribe
  disconnectedCallback() {
    this.unsubscribeFromMessageChannel();
  }
  // Navigates to record page
  navigateToRecordViewPage() {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.boatId,
        objectApiName: "Boat__c",
        actionName: "view"
      }
    });
  }

  // Navigates back to the review list, and refreshes reviews component
  handleReviewCreated() {
    this.template.querySelector("lightning-tabset").activeTabValue = "reviews";
    this.template.querySelector("c-boat-reviews").refresh();
  }
}
