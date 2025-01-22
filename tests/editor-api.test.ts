import {
  getClothingProducts,
  getDesignerDesigns,
  getDesignById,
} from "../src/helpers/api/productEditorApi";

async function testEditorAPIs() {
  try {
    // Test getting clothing products
    console.log("Testing getClothingProducts...");
    const products = await getClothingProducts();
    console.log("Products received:", products.length);
    console.log("First product sample:", products[0]);

    // Test getting designer designs (use a test designer ID)
    console.log("\nTesting getDesignerDesigns...");
    const testDesignerId = "678f3ea425e14c71891f0f23";
    const designs = await getDesignerDesigns(testDesignerId);
    console.log("Designs received:", designs.length);

    // Test getting specific design (use a test design ID)
    console.log("\nTesting getDesignById...");
    const testDesignId = "678fca1a4314de6003c0ad3f";
    const design = await getDesignById(testDesignId);
    console.log("Design details:", design);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testEditorAPIs();
