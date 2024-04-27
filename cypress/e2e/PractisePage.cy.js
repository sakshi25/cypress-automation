import PractisePage from "../PageObjects/PractisePage";

describe("Practise Page Test Suite", () => {
  let userdata;
  //Executed Once for loading all data
  before(() => {
    cy.fixture("practisepage").then((data) => {
      userdata = data;
    });
  });
  beforeEach(() => {
    //runs before Each Test in the block
    cy.visit("http://127.0.0.1:8080/task.html");
  });

  //Declaration of PageObject Class
  const pageElements = new PractisePage();

  //Check Title of Page
  it("Check Title of Page", () => {
    cy.title().should("eq", "Practice Page");
  });
  //Test Dropdown value selection
  it("Test Dropdown value selection", () => {
    cy.get(pageElements.dropdownOptions)
      .select("option2")
      .should("have.value", "option2");
  });
  //File Upload Test
  it("File Upload Test", () => {
    cy.get(pageElements.inputImage).attachFile("test1.jpg");
  });

  //Open Tab Test
  it("Open Tab Test", () => {
    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");
    });

    cy.get(pageElements.openTab).click();
    cy.get("@windowOpen").should(
      "have.been.calledOnceWithExactly",
      "https://easygenerator.com",
      "_blank"
    );
  });

  //Alert Button Test
  it("Alert Button Test", () => {
    //cy.task to read from sample alert file
    //using fixture for getting file Path from json file

    cy.task("readFile", userdata.alertTextFilePath).then((textOrNull) => {
      console.log(textOrNull);
      cy.get(pageElements.inputName).type(textOrNull);
    });

    cy.get(pageElements.btnAlert).click();
    cy.on("window:alert", (t) => {
      expect(t).to.contains(
        "Hello Hello from Easygenerator, share this practice page and share your knowledge"
      );
    });
  });
  //Confirmation Button Test
  it("Confirmation Button Test", () => {
    cy.get(pageElements.inputName).type("World");
    cy.get(pageElements.btnConfirm).click();
    cy.on("window:confirm", (t) => {
      expect(t).to.contains(
        "Hello World, share this practice page and share your knowledge"
      );
    });
  });
  //Show and Hide Input Test
  it("Show and Hide Input Test", () => {
    cy.get(pageElements.btnHide).click();
    cy.get(pageElements.txtDisplay).should("not.be.visible");
    cy.get(pageElements.btnShow).click();
    cy.get(pageElements.txtDisplay).should("be.visible");
  });
  //Mouse Hover Test
  it("Mouse Hover Test", () => {
    cy.get(pageElements.btnMouseHover).trigger("mouseover").click();
    cy.get(pageElements.hoverElement).should("be.visible");
  });
  //Iframe Load Test
  it("Iframe Load Test", () => {
    const iframe = cy
      .get(pageElements.pageIframe)
      .its("0.contentDocument.body")
      .should("be.visible")
      .then(cy.wrap);
  });
});
