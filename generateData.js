const fs = require("fs");
const { faker } = require("@faker-js/faker"); // Updated import

const generateContacts = (count = 100) => {
  const contacts = [];
  for (let i = 1; i <= count; i++) {
    contacts.push({
      id: i,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      dob: faker.date
        .past(30, new Date(2000, 0, 1))
        .toISOString()
        .split("T")[0],
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zipCode: faker.address.zipCode(),
    });
  }
  return contacts;
};

const data = {
  contacts: generateContacts(150), // Generate 150 records
};

fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
console.log("Mock data generated and saved to db.json");
