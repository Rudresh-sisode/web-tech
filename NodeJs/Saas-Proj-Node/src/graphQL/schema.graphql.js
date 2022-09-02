const {buildSchema} = require('graphql');

module.exports = buildSchema(`

    type TestData{
        text:String!
        views:Int!
    }

    input AdminLoginInput{
        streamName:String!
    }
    input AdminSignInInput{
        email:String!
        otp:String!
    }
    type ResourceDataAdminSignInOutputMessage{
        resource:String!
        action:[String]!
    }
    type userDataAdminSignInOutputMessage{
        emailId:String!
        userName:String!
        userId:String!
        role:String!
        companyId:String!
    }
    type DataAdminSignInOutputMessage{
        resourceData:[ResourceDataAdminSignInOutputMessage!]!
        userData: userDataAdminSignInOutputMessage!
    }
    type AdminSignInOutputMessage{
        refToken:String!
        accToken:String!
        data: DataAdminSignInOutputMessage!
        status:String!
    }
    type AdminLoginMessage{
        message:String!
    }

    input CompanyRegistrationInput{
        companyName:String!
        companyEmail:String!
        companyAddress:String!
        city:String!
        zipcode:String!
        stateKey:String!
        officeNumber:String!     
        userName:String!
        userEmail:String!   
    }
    type CompanyRegistratioOutput{
        message:String!
        cmpEmail:String!
        userEmail:String!
    }

    type InactiveCompanyOutput{
        cmpId:ID!
        companyName:String!
        companyEmail:String!
        address1:String!
        city:String!
        zipCode:String!
        stateKey:String!
        officeNumber:String
        isActive:Boolean!
        isDeleted:Boolean!
        createdAt:String
        createdBy:String        
    }
    type InactiveCompanyOutputLog{
        status:String!
        message:String!
        data:[InactiveCompanyOutput!]!
        statusCode:Int!

    }

    input DepartmentInput{
        depValue:String!
    }
    type DepartmentOutput{
        status:String!
        message:String!
        statusCode:Int!
    }

    input DesignationInput{
        desValue:String!
    }
    type DesignationOutput{
        status:String!
        message:String!
        statusCode:Int!
    }

    input SkillInput{
        skillValue:String!
        version:String!
    }
    type SkillOutput{
        status:String!
        message:String!
        statusCode:Int!
    }

    input InputSkill{
        skillValue:String!
        version:String!
    }
    input MultiSkillInput{
        skillInputs:[InputSkill!]!
    }

    input TechnologyInput{
        techValue:String!
        departId:String!
    }
    type TechnologyOutput{
        status:String!
        message:String!
        statusCode:Int!
    }
   

    input InputTechnology{
        techValue:String!
        departId:String!
    }
    input MultiTechnologyInput{
        techInputs:[InputTechnology!]!
    }
    

    input MultiDepartmentInput{
        depValues:[String!]!
    }
    

    input MultiDesignationInput{
        desValues:[String!]!
    }
    



    type RootMutation {
        AdminOtpGenerate(adminInput: AdminLoginInput!): AdminLoginMessage!
        RegisterCompany(companyInput:CompanyRegistrationInput!): CompanyRegistratioOutput!
        UserOtpGenerate(userInput:AdminLoginInput!):AdminLoginMessage!
        AddDepartment(departmentInput:DepartmentInput!):DepartmentOutput!
        AddMultiDepartment(multiDepartmentInput:MultiDepartmentInput!):DepartmentOutput!
        AddDesignation(designationInput:DesignationInput!):DesignationOutput!
        AddMultiDesignation(multiDesignationInput:MultiDesignationInput!):DesignationOutput!
        AddSkill(skillInput:SkillInput!):SkillOutput!
        AddMultiSkill(multiSkillInput:MultiSkillInput!):SkillOutput!
        AddTechnology(technologyInput:TechnologyInput!):TechnologyOutput!
        AddMultiTechnology(multiTechnologyInput:MultiTechnologyInput!):TechnologyOutput!

    }


    type RootQuery{
        hello:[TestData!]
        AdminSignIn(adminSignInInput:AdminSignInInput!):AdminSignInOutputMessage!
        UserSignIn(userSignInInput:AdminSignInInput!):AdminSignInOutputMessage!
        InactiveCompanyLog:InactiveCompanyOutputLog!
    }

    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);