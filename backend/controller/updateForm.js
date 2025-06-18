const Company = require("../models/company.js"); // Model for Company
const Address = require("../models/Address.js"); // Model for Address
const Contacts = require("../models/contacts.js"); // Model for Contacts
const MeetingLog = require("../models/meetingLog.js"); // Model for Meeting Log
const ManageCP = require("../models/manageCP.js"); // Model for ManageCP
const UpdateInfo = require("../models/UpdateInfo.js"); // Model for UpdateInfo
const Department = require("../models/departments.js");

const sequelize = require("../utils/database.js"); // Sequelize database instance

/**
 * Updates a company's information and related records based on the provided company number.
 *
 * @param {Object} req - The request object containing company data in the body.
 * @param {Object} res - The response object to send the result back to the client.
 */
const updateFormByCompanyNumber = async (req, res) => {
  // Extract company number and other data from the request body
  const companyNumber = req.body.companyNumber;
  const {
    nameOfCompany,
    addresses,
    companyWebsite,
    companyEmail,
    companyTelephone,
    linkdinProfile,
    category,
    sector,
    subsector,
    isClientActive,
    toWhom,
    date,
    reason,
    remark,
    frontdeskAddress,
    tallyAddress,
    updatedBy,
    manageCP = [], // Ensure manageCP is an array
  } = req.body;

  // Start a transaction to ensure all operations succeed or fail together
  const transaction = await sequelize.transaction();

  try {
    // Find the company by its company number
    let company = await Company.findOne({
      where: { companyNumber: companyNumber },
      transaction, // Use the transaction
    });

    // If no company is found, roll back the transaction and send a 404 error
    if (!company) {
      await transaction.rollback();
      return res.status(404).json({ message: "Company not found" });
    }

    // Fetch current addresses associated with the company
    const currentAddresses = await Address.findAll({
      where: { companyNumber: company.companyNumber },
      include: [
        {
          model: Contacts, // Include related contacts
          as: "contacts",
          include: [{ model: MeetingLog, as: "meetinglog" }], // Include meeting logs
        },
      ],
      transaction, // Use the transaction
    });

    // Fetch current manageCP records associated with the company
    const currentManageCPs = await ManageCP.findAll({
      where: { companyNumber: company.companyNumber },
      transaction, // Use the transaction
    });

    const currentUpdateInfo = await UpdateInfo.findAll({
      where: { companyNumber: company.companyNumber },
      transaction,
    });

    // Identify addresses to be deleted
    const currentAddressIds = currentAddresses.map((addr) => addr.id); // Current address IDs
    const newAddressIds = addresses
      .filter((addr) => addr.id) // Filter for existing addresses with IDs
      .map((addr) => addr.id); // New address IDs
    const deletedAddresses = currentAddressIds.filter(
      (id) => !newAddressIds.includes(id) // Identify addresses to be deleted
    );

    // Extract contact IDs from current addresses
    const currentContactIds = currentAddresses.flatMap((addr) =>
      addr.contacts.map((contact) => contact.id)
    );
    const newContactIds = addresses
      .flatMap((addr) => addr.contacts || []) // Extract new contact IDs
      .filter((contact) => contact.id)
      .map((contact) => contact.id);
    const deletedContacts = currentContactIds.filter(
      (id) => !newContactIds.includes(id) // Identify contacts to be deleted
    );

    // Extract meeting log IDs from current contacts
    const currentMeetingLogIds = currentAddresses.flatMap((addr) =>
      addr.contacts.flatMap((contact) =>
        contact.meetinglog.map((log) => log.id)
      )
    );

    const newMeetingLogIds = addresses
      .flatMap((addr) => addr.contacts || [])
      .flatMap((contact) => contact.meetinglog || [])
      .filter((log) => log.id)
      .map((log) => log.id);
    const deletedMeetingLogs = currentMeetingLogIds.filter(
      (id) => !newMeetingLogIds.includes(id) // Identify meeting logs to be deleted
    );

    // Identify manageCP IDs to be deleted
    const currentManageCPIds = currentManageCPs.map((cp) => cp.id); // Current manageCP IDs
    const newManageCPIds = manageCP
      .filter((cp) => cp.id) // Filter for existing manageCP with IDs
      .map((cp) => cp.id); // New manageCP IDs
    const deletedManageCPs = currentManageCPIds.filter(
      (id) => !newManageCPIds.includes(id) // Identify manageCP to be deleted
    );

    // Update the company's information
    company = await company.update(
      {
        nameOfCompany,
        companyWebsite,
        companyEmail,
        companyTelephone,
        linkdinProfile,
        category,
        sector,
        subsector,
        isClientActive,
        toWhom,
        date,
        reason,
        remark,
        frontdeskAddress,
        tallyAddress,
        updatedBy,
      },
      { transaction } // Use the transaction
    );

    // Handle updating or creating addresses
    if (addresses && Array.isArray(addresses)) {
      await Promise.all(
        addresses.map(async (addressInfo) => {
          let address; // Variable to hold address
          if (addressInfo.id) {
            // If address ID exists, update the address
            address = await Address.findByPk(addressInfo.id, { transaction });
            if (address) {
              await address.update(
                {
                  ...addressInfo, // Spread the new address info
                  companyNumber: company.companyNumber, // Set the company number
                },
                { transaction }
              );
            }
          } else {
            // If no ID, create a new address
            address = await Address.create(
              {
                ...addressInfo,
                companyNumber: company.companyNumber, // Set the company number
              },
              { transaction }
            );
          }

          // Handle contacts associated with the address
          if (addressInfo.contacts && Array.isArray(addressInfo.contacts)) {
            await Promise.all(
              addressInfo.contacts.map(async (contactInfo) => {
                let contact; // Variable to hold contact
                if (contactInfo.id) {
                  // If contact ID exists, update the contact
                  contact = await Contacts.findByPk(contactInfo.id, {
                    transaction,
                  });
                  if (contact) {
                    await contact.update(
                      {
                        ...contactInfo, // Spread the new contact info
                        AddressNumber: address.id, // Set the address number
                      },
                      { transaction }
                    );
                  }
                } else {
                  // If no ID, create a new contact
                  contact = await Contacts.create(
                    {
                      ...contactInfo,
                      AddressNumber: address.id, // Set the address number
                    },
                    { transaction }
                  );
                }

                // Handle departments associated with the contact
                if (
                  contactInfo.departments &&
                  Array.isArray(contactInfo.departments)
                ) {
                  await Promise.all(
                    contactInfo.departments.map(async (departmentInfo) => {
                      let department;

                      if (departmentInfo.id) {
                        // Find and update existing department if ID exists
                        const existingDepartment = await Department.findByPk(
                          departmentInfo.id,
                          { transaction }
                        );
                        if (existingDepartment) {
                          await existingDepartment.update(
                            {
                              department_name: departmentInfo.department_name,
                              sub_department_name:
                                departmentInfo.sub_department_name,
                                contactId: contact.id,
                            },
                            { transaction }
                          );
                        }
                      } else {
                        // Create new department if ID doesn't exist
                        await Department.create(
                          {
                            department_name: departmentInfo.department_name,
                            sub_department_name:
                              departmentInfo.sub_department_name,
                            contactId: contact.id,
                          },
                          { transaction }
                        );
                      }
                    })
                  );
                }

                // Handle meeting logs associated with the contact
                if (
                  contactInfo.meetinglog &&
                  Array.isArray(contactInfo.meetinglog)
                ) {
                  await Promise.all(
                    contactInfo.meetinglog.map(async (meetingLogInfo) => {
                      if (meetingLogInfo.id) {
                        // If meeting log ID exists, update the meeting log
                        const existingMeetingLog = await MeetingLog.findByPk(
                          meetingLogInfo.id,
                          { transaction }
                        );
                        if (existingMeetingLog) {
                          await existingMeetingLog.update(
                            {
                              ...meetingLogInfo, // Spread the new meeting log info
                              contactNumber: contact.id, // Set the contact number
                            },
                            { transaction }
                          );
                        }
                      } else {
                        // If no ID, create a new meeting log
                        await MeetingLog.create(
                          {
                            ...meetingLogInfo,
                            contactNumber: contact.id, // Set the contact number
                          },
                          { transaction }
                        );
                      }
                    })
                  );
                }
              })
            );
          }
        })
      );
    }

    // Delete removed addresses, contacts, meeting logs, and manageCP records
    if (deletedAddresses.length > 0) {
      await Promise.all(
        deletedAddresses.map(async (addressId) => {
          const address = await Address.findByPk(addressId, { transaction });
          if (address) {
            // Delete associated contacts before deleting the address
            await Contacts.destroy({
              where: { AddressNumber: addressId },
              transaction,
            });
            await address.destroy({ transaction }); // Delete the address
          }
        })
      );
    }

    if (deletedContacts.length > 0) {
      await Promise.all(
        deletedContacts.map(async (contactId) => {
          const contact = await Contacts.findByPk(contactId, { transaction });
          if (contact) {
            // Delete associated meeting logs before deleting the contact
            await MeetingLog.destroy({
              where: { contactNumber: contactId },
              transaction,
            });
            await contact.destroy({ transaction }); // Delete the contact
          }
        })
      );
    }

    if (deletedMeetingLogs.length > 0) {
      await Promise.all(
        deletedMeetingLogs.map(async (meetingLogId) => {
          const meetingLog = await MeetingLog.findByPk(meetingLogId, {
            transaction,
          });
          if (meetingLog) {
            await meetingLog.destroy({ transaction }); // Delete the meeting log
          }
        })
      );
    }

    // Handle manageCP records update/creation
    if (manageCP && Array.isArray(manageCP)) {
      // Create or update ManageCP records
      const currentManageCPs = await ManageCP.findAll({
        where: { companyNumber: companyNumber },
        transaction,
      });

      const currentManageCPIds = currentManageCPs.map((cp) => cp.id);
      const newManageCPIds = manageCP.filter((cp) => cp.id).map((cp) => cp.id);

      // Identify ManageCP records to be deleted
      const deletedManageCPs = currentManageCPIds.filter(
        (id) => !newManageCPIds.includes(id)
      );

      // Delete removed ManageCP records
      if (deletedManageCPs.length > 0) {
        await ManageCP.destroy({
          where: { id: deletedManageCPs },
          transaction,
        });
      }

      // Create or update ManageCP records
      await Promise.all(
        manageCP.map(async (cpInfo) => {
          let manageCPEntry;
          if (cpInfo.id) {
            // Update existing ManageCP record
            manageCPEntry = await ManageCP.findByPk(cpInfo.id, { transaction });
            if (manageCPEntry) {
              await manageCPEntry.update(
                {
                  ...cpInfo, // Spread the new cp info
                  companyNumber: company.companyNumber, // Set the company number
                },
                { transaction }
              );
            }
          } else {
            // Create new ManageCP record
            manageCPEntry = await ManageCP.create(
              {
                ...cpInfo, // Spread the new cp info
                companyNumber: company.companyNumber, // Set the company number
              },
              { transaction }
            );
          }
        })
      );
    }

    await UpdateInfo.create(
      {
        updatedBy: company.updatedBy,
        companyNumber: company.companyNumber,
      },
      { transaction }
    );

    // Commit transaction
    await transaction.commit();

    // Fetch updated company details
    const updatedCompany = await Company.findOne({
      where: { companyNumber: company.companyNumber },
      include: [
        {
          model: Address,
          as: "addresses",
          include: [
            {
              model: Contacts,
              as: "contacts",
              include: [{ model: MeetingLog, as: "meetinglog" }],
            },
          ],
        },
        {
          model: ManageCP,
          as: "manageCP",
        },
        {
          model: UpdateInfo,
          as: "update_info",
        },
      ],
    });

    res.status(200).json({
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating company", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  updateFormByCompanyNumber,
};
