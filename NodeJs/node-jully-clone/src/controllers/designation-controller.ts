//modules imports below
import validator from "validator";
import moment from 'moment';
require('dotenv').config();

import UserTableModel from "../abstractions/models/user-table-model";
import sequelize from "../utilities/database-connect";
import UserRequest from "../abstractions/classes/interfaces/user-request-data-model";
import DesignationTableModel from "../abstractions/models/designation-table-model";

const addDesignation = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try {

    const designationName: string = req.body.designationName;
    const designationValue: string = req.body.designationValue;

    if (validator.isEmpty(designationValue) || validator.isEmpty(designationName) || !validator.equals(designationValue.trim().toLowerCase(), designationName.trim().toLowerCase() ) ) {
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
    const isDepartmentExist: any = await DesignationTableModel.findOne({ where: { designation_name: designationName.trim().toUpperCase(), is_deleted: false }, raw: true });
    if (isDepartmentExist) {
      status = 401;
      throw new Error("Designation already exist!");
    }

    // add designation to database
    const designation: any = await DesignationTableModel.create({
      designation_name: designationName.trim().toUpperCase(),
      designation_value: designationValue.trim().toLowerCase(),
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      created_by: req.keyId
    }, { transaction: tscn });

    step = 5;
    if(!designation) {
        status = 401;
        throw new Error("Designation not added!");
    }


    await tscn.commit();
    return res.status(status).json({
      status: "success",
      data: "Designation added successfully!"
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

const updateDesignation = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try {

    const designationId: string = req.params.designationId;
    const designationName: string = req.body.designationName;
    const designationValue: string = req.body.designationValue;

    if (!validator.isUUID(designationId) || validator.isEmpty(designationValue) || validator.isEmpty(designationName) || !validator.equals(designationValue.trim().toLowerCase(), designationName.trim().toLowerCase())) {
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
    // check if designation is exist or not
    const designation: any = await DesignationTableModel.findOne({ where: { id: designationId, is_deleted: false }, raw: true });
    if (!designation) {
      status = 404;
      throw new Error("Designation not found!");
    }

    step = 5;
    // check if designation name already exist or not
    const isDesignationExist: any = await DesignationTableModel.findOne({ where: { designation_name: designationName.trim().toUpperCase(), is_deleted: false }, raw: true });
    if (isDesignationExist && isDesignationExist.id !== designationId) {
      status = 401;
      throw new Error("Designation already exist!");
    }

    // update designation in database
    let updatedDesigntion = await DesignationTableModel.update({
      designation_name: designationName.trim().toUpperCase(),
      designation_value: designationValue.trim().toLowerCase(),
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      updated_by: req.keyId
    }, { where: { id: designationId }, transaction: tscn });

    step = 6;
    if(!('0' in updatedDesigntion) || updatedDesigntion['0'] == null || updatedDesigntion['0'] == undefined || updatedDesigntion['0'] == 0)
    { 
        status = 500; 
        throw new Error("Designation updatation failed!"); 
    }

    await tscn.commit();
    return res.status(status).json({
      status: "success",
      message: "Designation updated successfully"
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

const deleteDesignation = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try {

    const designationId: string = req.params.designationId;

    if (!validator.isUUID(designationId)) {
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
    // check if designation is exist or not
    const designation: any = await DesignationTableModel.findOne({ where: { id: designationId, is_deleted: false }, raw: true });
    if (!designation) {
      status = 404;
      throw new Error("Designation not found!");
    }

    // delete designation from database
    let deleteDesignation = await DesignationTableModel.update({
      is_deleted: true,
      deleted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      deleted_by: req.keyId
    }, { where: { id: designationId }, transaction: tscn });

    step = 5;
    if(!('0' in deleteDesignation) || deleteDesignation['0'] == null || deleteDesignation['0'] == undefined || deleteDesignation['0'] == 0)
    {
        status = 500;
        throw new Error("Designation deletion failed!");
    }


    await tscn.commit();
    return res.status(status).json({
      status: "success",
      message: "Designation deleted successfully"
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

const getDesignationById = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  try {

    const designationId: string = req.params.designationId;

    if (!validator.isUUID(designationId)) {
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
    // check if designation is exist or not
    const designation: any = await DesignationTableModel.findOne({ where: { id: designationId, is_deleted: false }, raw: true, attributes: [['id','desId'], ['designation_name','designationName'], ['designation_value','designationValue']] });
    if (!designation) {
      status = 404;
      throw new Error("Designation not found!");
    }

    return res.status(status).json({
      status: "success",
      data: designation
    });

  }
  catch (error: any) {
    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message
    });
  }
}

const getAllDesignations = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  try {

    // check if user is exist or not
    const isEmailExist: any = await UserTableModel.findOne({ where: { email: req.email, is_deleted: false }, raw: true });
    if (!isEmailExist) {
      status = 404;
      throw new Error("User does not exist!");
    }

    step = 2;
    const isUserActive: any = await UserTableModel.findOne({ where: { email: req.email, is_active: true }, raw: true });
    if (!isUserActive) {
      status = 404;
      throw new Error("User does not active!");
    }

    step = 3;
    // retrieve all designations from database
    const designations: any = await DesignationTableModel.findAll({ where: { is_deleted: false }, raw: true, attributes: [['id','desId'], ['designation_name','designationName'], ['designation_value','designationValue']] });
    if (!designations) {
        status = 404;
        throw new Error("Designations not found!");
    }

    return res.status(status).json({
      status: "success",
      data: designations
    });

  }
  catch (error: any) {
    console.log(`step ${step} error: ${error}`);
    return res.status(status === 200 ? 500 : status).json({
      status: "error",
      message: error.message
    });
  }
}


export {addDesignation,updateDesignation,deleteDesignation,getDesignationById,getAllDesignations};