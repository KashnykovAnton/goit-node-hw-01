const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const chalk = require("chalk");

const contactsPath = async () => {
  try {
    const content = await fs.readFile(
      path.join(__dirname, "db", "contacts.json"),
      "utf8"
    );
    const result = JSON.parse(content);
    return result;
  } catch (error) {
    console.error(chalk.bgRed(error));
    process.exit(1);
  }
};

const listContacts = async () => {
  try {
    return await contactsPath();
  } catch (error) {
    console.error(chalk.bgRed(error));
    process.exit(1);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await contactsPath();
    const [contact] = contacts.filter((item) => item.id === contactId);
    return contact;
  } catch (error) {
    console.error(chalk.bgRed(error));
    process.exit(1);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await contactsPath();
    const newContacts = contacts.filter((item) => item.id !== contactId);
    const [delContact] = contacts.filter((item) => item.id === contactId);
    await fs.writeFile(
      path.join(__dirname, "db", "contacts.json"),
      JSON.stringify(newContacts, null, 2)
    );
    return delContact;
  } catch (error) {
    console.error(chalk.bgRed(error));
    process.exit(1);
  }
};

const addContact = async (name, email, phone) => {
  try {
    const contacts = await contactsPath();
    const newContact = { name, email, phone, id: crypto.randomUUID() };
    contacts.push(newContact);
    await fs.writeFile(
      path.join(__dirname, "db", "contacts.json"),
      JSON.stringify(contacts, null, 2)
    );
    return newContact;
  } catch (error) {
    console.error(chalk.bgRed(error));
    process.exit(1);
  }
};

const updateContact = async (name, email, phone, contactId) => {
  try {
    const contacts = await contactsPath();
    let updContact = contacts.find((item) => item.id === contactId);
    if (!updContact) {
      return;
    }
    updContact = { ...updContact, name, email, phone };
    const index = contacts.findIndex((item) => item.id === contactId);
    contacts.splice(index, 1, updContact);
    await fs.writeFile(
      path.join(__dirname, "db", "contacts.json"),
      JSON.stringify(contacts, null, 2)
    );
    return updContact;
  } catch (error) {
    console.error(chalk.bgRed(error));
    process.exit(1);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
