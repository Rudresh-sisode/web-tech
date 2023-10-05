//modules imports below
import validator from "validator";
import moment from 'moment';
require('dotenv').config();

import UserTableModel from "../abstractions/models/user-table-model";
import sequelize from "../utilities/database-connect";
import UserRequest from "../abstractions/classes/interfaces/user-request-data-model";
import DepartmentTableModel from "../abstractions/models/department-table-model";

const addDepartment = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try {

    const departmentName: string = req.body.departmentName;
    const departmentValue: string = req.body.departmentValue;

    if (validator.isEmpty(departmentName) || validator.isEmpty(departmentValue)) {
      status = 400;
      throw new Error("Input value is invalid!");
    }

    step = 2;
    // check if user is exist or not
    const isEmailExist: any = await UserTableModel.findOne({ where: { email: req.email, is_deleted: false }, raw: true });
    if (!isEmailExist) {
      status = 404;
      throw new Error("User does not exist!");
    }

    step = 3;
    const isUserActive: any = await UserTableModel.findOne({ where: { email: req.email, is_active: true }, raw: true });
    if (!isUserActive) {
      status = 404;
      throw new Error("User does not active!");
    }

    step = 4;
    // check if department exist
    const isDepartmentExist: any = await DepartmentTableModel.findOne({ where: { department_value: departmentValue.trim().toLowerCase(), is_deleted: false }, raw: true });
    if (isDepartmentExist) {
        status = 409;
        throw new Error("Department already exist!");
    }

    // add department to database
     await DepartmentTableModel.create({
      department_name: departmentName.toUpperCase(),
      department_value: departmentValue.toLowerCase(),
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      created_by: req.keyId
    }, { transaction: tscn });

    await tscn.commit();
    return res.status(status).json({
      status: "success",
      message:"Department added successfully!"
    });

  }
  catch (error: any) {
    await tscn.rollback();
    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message
    });
  }
}

const updateDepartment = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try {

    const departmentId: string = req.params.departmentId;
    const departmentName: string = req.body.departmentName;
    const departmentValue: string = req.body.departmentValue;

    if (!validator.isUUID(departmentId) || validator.isEmpty(departmentName) || validator.isEmpty(departmentValue)) {
      status = 400;
      throw new Error("Input value is invalid!");
    }

    step = 2;
    // check if user is exist or not
    const isEmailExist: any = await UserTableModel.findOne({ where: { email: req.email, is_deleted: false }, raw: true });
    if (!isEmailExist) {
      status = 404;
      throw new Error("User does not exist!");
    }

    step = 3;
    const isUserActive: any = await UserTableModel.findOne({ where: { email: req.email, is_active: true }, raw: true });
    if (!isUserActive) {
      status = 404;
      throw new Error("User does not active!");
    }

    step = 4;
    // check if department is exist or not
    const isDepartmentExist: any = await DepartmentTableModel.findOne({ where: { id: departmentId, is_deleted: false }, raw: true });
    if (!isDepartmentExist) {
      status = 404;
      throw new Error("Department not found!");
    }

    step = 5;
    const isDepartment: any = await DepartmentTableModel.findOne({ where: { department_name: departmentName.trim().toUpperCase(), is_deleted: false }, raw: true });
    if (isDepartment) {
      status = 404;
      throw new Error("Department exist, no changed required!");
    }

    // update department in database
    const updateDepartment = await DepartmentTableModel.update({
      department_name: departmentName.trim().toUpperCase(),
      department_value: departmentValue.trim().toLowerCase(),
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      updated_by: req.keyId
    }, { where: { id: departmentId, is_deleted: false }, transaction: tscn });

    step = 6;
    if(!('0' in updateDepartment) || updateDepartment['0'] == null || updateDepartment['0'] == undefined || updateDepartment['0'] == 0)
    { 
        status = 500; 
        throw new Error("Department updatation failed!"); 
    }

    await tscn.commit();
    return res.status(status).json({
      status: "success",
      message: "Department updated successfully!"
    });

  }
  catch (error: any) {
    await tscn.rollback();
    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message
    });
  }
}

const deleteDepartment = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try {

    const departmentId: string = req.params.departmentId;

    if (!validator.isUUID(departmentId)) {
      status = 400;
      throw new Error("Input value is invalid!");
    }

    step = 2;
    // check if user is exist or not
    const isEmailExist: any = await UserTableModel.findOne({ where: { email: req.email, is_deleted: false }, raw: true });
    if (!isEmailExist) {
      status = 404;
      throw new Error("User does not exist!");
    }

    step = 3;
    const isUserActive: any = await UserTableModel.findOne({ where: { email: req.email, is_active: true }, raw: true });
    if (!isUserActive) {
      status = 404;
      throw new Error("User does not active!");
    }

    step = 4;
    // check if department is exist or not
    const isDepartmentExist: any = await DepartmentTableModel.findOne({ where: { id: departmentId, is_deleted: false }, raw: true });
    if (!isDepartmentExist) {
      status = 404;
      throw new Error("Department not found!");
    }

    // delete department from database
    const deleteDepartment = await DepartmentTableModel.update({
      is_deleted: true,
      deleted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      deleted_by: req.keyId
    }, { where: { id: departmentId, is_deleted: false }, transaction: tscn });

    if(!('0' in deleteDepartment) || deleteDepartment['0'] == null || deleteDepartment['0'] == undefined || deleteDepartment['0'] == 0)
    { 
        status = 500; 
        throw new Error("Department deletion failed!"); 
    }

    await tscn.commit();
    return res.status(status).json({
      status: "success",
      message: "Department deleted successfully!"
    });

  }
  catch (error: any) {
    await tscn.rollback();
    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message
    });
  }
}

const getDepartmentById = async (req: UserRequest, res: any, next: any) => {
  let status = 200, step = 1;
  try {

    const departmentId: string = req.params.departmentId;

    if (!validator.isUUID(departmentId)) {
      status = 400;
      throw new Error("Input value is invalid!");
    }

    step = 2;
    // check if user is exist or not
    const isEmailExist: any = await UserTableModel.findOne({ where: { email: req.email, is_deleted: false }, raw: true });
    if (!isEmailExist) {
      status = 404;
      throw new Error("User does not exist!");
    }

    step = 3;
    const isUserActive: any = await UserTableModel.findOne({ where: { email: req.email, is_active: true }, raw: true });
    if (!isUserActive) {
      status = 404;
      throw new Error("User does not active!");
    }

    step = 4;
    // check if department is exist or not
    const department: any = await DepartmentTableModel.findOne({ where: { id: departmentId, is_deleted: false }, raw: true, attributes: [['id','depId'], ['department_name','departmentName'], ['department_value','departmentValue']] });
    if (!department) {
      status = 404;
      throw new Error("Department not found!");
    }

    return res.status(status).json({
      status: "success",
      data: department
    });

  }
  catch (error: any) {
    console.log(`error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message
    });
  }
}

const getAllDepartments = async (req: UserRequest, res: any, next: any) => {
  let status = 200,step = 1;
  try {

    // check if user is exist or not
    const isEmailExist: any = await UserTableModel.findOne({ where: { email: req.email, is_deleted: false }, raw: true });
    if (!isEmailExist) {
      status = 404;
      throw new Error("User does not exist!");
    }

    step = 2;
    // check if user is active or not
    const isUserActive: any = await UserTableModel.findOne({ where: { email: req.email, is_active: true }, raw: true });
    if (!isUserActive) {
        status = 404;
        throw new Error("User does not active!");
    }

    step = 3;
    const departments: any = await DepartmentTableModel.findAll({ where: { is_deleted: false }, raw: true, attributes: [['id','depId'], ['department_name','departmentName'], ['department_value','departmentValue']] });
    if (!departments) {
        status = 404;
        throw new Error("Departments not found!");
    }

    return res.status(status).json({
      status: "success",
      data: departments
    });

  }
  catch (error: any) {
    console.log(`error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message
    });
  }
}



export { addDepartment,updateDepartment,deleteDepartment,getDepartmentById,getAllDepartments};