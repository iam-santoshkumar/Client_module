const Company = require("../models/company.js");
const Address = require("../models/Address.js");
const Contacts = require("../models/contacts.js");
const MeetingLog = require("../models/meetingLog.js");
const ManageCP = require("../models/manageCP.js"); // Make sure this is the correct model
const UpdateInfo = require("../models/UpdateInfo.js"); // Model for UpdateInfo
const Department = require("../models/departments.js");

const createForm = async (req, res) => {
  try {
    const {
      nameOfCompany,
      addresses,
      companyWebsite,
      companyEmail,
      companyTelephone,
      category,
      sector,
      subsector,
      linkdinProfile,
      isClientActive,
      toWhom,
      date,
      reason,
      remark,
      frontdeskAddress,
      tallyAddress,
      addedBy,
      manageCP,
    } = req.body;

    console.log(req.body);
    // const existingCompany = await Company.findOne({ where: { nameOfCompany } });

    // if (existingCompany) {
    //   return res.status(409).json({ message: "Company already exists" });
    // }

    const createdCompany = await Company.create({
      nameOfCompany,
      companyWebsite,
      companyEmail,
      companyTelephone,
      category,
      sector,
      subsector,
      linkdinProfile,
      isClientActive,
      toWhom,
      date,
      reason,
      remark,
      frontdeskAddress,
      tallyAddress,
      addedBy,
    });

    if (addresses && Array.isArray(addresses)) {
      const createdAddresses = await Promise.all(
        addresses.map(async (addressInfo) => {
          const createdAddress = await Address.create({
            ...addressInfo,
            companyNumber: createdCompany.companyNumber,
          });

          if (addressInfo.contacts && Array.isArray(addressInfo.contacts)) {
            const createdContacts = await Promise.all(
              addressInfo.contacts.map(async (contactInfo) => {
                const createdContact = await Contacts.create({
                  ...contactInfo,
                  AddressNumber: createdAddress.id,
                });

                if (contactInfo.departments && Array.isArray(contactInfo.departments)) {
                  const createdDepartments = await Promise.all(
                    contactInfo.departments.map(async (department) => {
                      // Convert sub_department_name array into a comma-separated string
                      let subDepartmentNames = department.sub_department_name;
                      if (Array.isArray(subDepartmentNames)) {
                        subDepartmentNames = subDepartmentNames.join(', ');
                      } else if (typeof subDepartmentNames !== 'string') {
                        // If it's not an array or string, fallback to string
                        subDepartmentNames = String(subDepartmentNames);
                      }
                
                      // Create department with comma-separated sub_department_name
                      const createdDepartment = await Department.create({
                        ...department,
                        sub_department_name: subDepartmentNames,
                        contactId: createdContact.id,
                      });
                
                      return createdDepartment;
                    })
                  );
                }
                

                if (
                  contactInfo.meetinglog &&
                  Array.isArray(contactInfo.meetinglog)
                ) {
                  const createdMeetingLogs = await Promise.all(
                    contactInfo.meetinglog.map(async (meetingLogInfo) => {
                      const createdMeetingLog = await MeetingLog.create({
                        ...meetingLogInfo,
                        contactNumber: createdContact.id,
                      });
                      return createdMeetingLog;
                    })
                  );
                  console.log(
                    "Created Meeting Logs for Contact ",
                    createdContact.id,
                    ": ",
                    createdMeetingLogs
                  );
                }

                return createdContact;
              })
            );
            console.log(
              "Created Contacts for Address ",
              createdAddress.id,
              ": ",
              createdContacts
            );
          }

          return createdAddress;
        })
      );
      console.log("Created Addresses: ", createdAddresses);
    }

    if (manageCP && Array.isArray(manageCP)) {
      const createdProtocols = await Promise.all(
        manageCP.map(async (protocolInfo) => {
          return await ManageCP.create({
            ...protocolInfo,
            companyNumber: createdCompany.companyNumber,
          });
        })
      );
      console.log("Created Communication Protocols: ", createdProtocols);
    }

    // Handle update_info records
    // if (update_info && Array.isArray(update_info)) {
    //   await Promise.all(
    //     update_info.map(async (info) => {
    //       await UpdateInfo.create({
    //         ...info,
    //         companyNumber: createdCompany.companyNumber,
    //       });
    //     })
    //   );
    // }

    await UpdateInfo.create({
      addedBy: createdCompany.addedBy,
      companyNumber: createdCompany.companyNumber,
    });

    res.status(201).json({
      message: "Form data saved successfully",
      company: createdCompany,
    });
  } catch (error) {
    console.error("Error saving company data:", error);
    res
      .status(500)
      .json({ message: "Failed to save company data", error: error.message });
  }
};

module.exports = {
  createForm,
};
