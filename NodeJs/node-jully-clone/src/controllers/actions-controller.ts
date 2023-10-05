
//modules imports below
import validator from "validator";
import moment from 'moment';
require('dotenv').config();

import UserTableModel from "../abstractions/models/user-table-model";
import sequelize from "../utilities/database-connect";
import UserRequest from "../abstractions/classes/interfaces/user-request-data-model";
import ActionTableModel from "../abstractions/models/action-table-model";

const addAction = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try {

    const actionName: string = req.body.actionName;
    const actionValue: string = req.body.actionValue;

    if (validator.isEmpty(actionName) || validator.isEmpty(actionValue)) {
      status = 400;
      throw new Error("Input value is invalid!");
    }

    step = 2;
    // check if user is exist or not
    const isEmailExist: any = await UserTableModel.findOne({ where: { email: req.email, is_deleted: false }, raw: true });
    if (!isEmailExist || isEmailExist == null || isEmailExist == undefined) {
      status = 404;
      throw new Error("User does not exist!");
    }

    step = 3;
    const isUserActive: any = await UserTableModel.findOne({ where: { email: req.email, is_active: true }, raw: true });
    if (!isUserActive || isUserActive == null || isUserActive == undefined) {
      status = 404;
      throw new Error("User does not active!");
    }

    step = 4;
    // check if action is exist or not
    const isActionExist: any = await ActionTableModel.findOne({ where: { action_value: actionValue.trim().toLowerCase(), is_deleted: false }, raw: true });
    if (isActionExist || isActionExist != null || isActionExist != undefined) {
      status = 409;
      throw new Error("Action already exist!");
    }

    // add action to database
    await ActionTableModel.create({
      action_name: actionName.toUpperCase(),
      action_value: actionValue.toLowerCase(),
      is_deleted: false,
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      created_by: req.keyId
    }, { transaction: tscn });

    await tscn.commit();
    return res.status(status).json({
      status: "success",
      message: "Action added successfully!"
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

const getActionById = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  try {

    const actionId: string = req.params.actionId;

    const isEmailExist: any = await UserTableModel.findOne({ where: { email: req.email, is_deleted: false }, raw: true });
    if (!isEmailExist || isEmailExist == null || isEmailExist == undefined) {
      status = 404;
      throw new Error("User does not exist!");
    }
    step = 2;
    const isUserActive: any = await UserTableModel.findOne({ where: { email: req.email, is_active: true }, raw: true });
    if (!isUserActive || isUserActive == null || isUserActive == undefined) {
      status = 404;
      throw new Error("User does not active!");
    }

    step = 3;
    // check if action is exist or not
    const action: any = await ActionTableModel.findOne({ where: { id: actionId, is_deleted: false }, raw: true, attributes: [['id','actionId'], ['action_name','actionName'], ['action_value','actionValue']] });
    if (!action || action == null || action == undefined) {
      status = 404;
      throw new Error("Action not found!");
    }

    return res.status(status).json({
      status: "success",
      data: action
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

const getAllActions = async (req: UserRequest, res: any, next: any) => {
    let step = 1, status = 200;
    try {
  
      const isEmailExist: any = await UserTableModel.findOne({ where: { email: req.email, is_deleted: false }, raw: true });
      if (!isEmailExist || isEmailExist == null || isEmailExist == undefined) {
        status = 404;
        throw new Error("User does not exist!");
      }
      
        step = 2;
      const isUserActive: any = await UserTableModel.findOne({ where: { email: req.email, is_active: true }, raw: true });
      if (!isUserActive || isUserActive == null || isUserActive == undefined) {
        status = 404;
        throw new Error("User does not active!");
      }
      
        step = 3;
      const actions: any = await ActionTableModel.findAll({ where: { is_deleted: false }, raw: true, attributes: [['id','actionId'], ['action_name','actionName'], ['action_value','actionValue']] });
        if (!actions || actions == null || actions == undefined) {
            status = 404;
            throw new Error("Actions not found!");
        }
  
      return res.status(status).json({
        status: "success",
        data: actions
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

  const updateAction = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try {

    const actionId: string = req.params.actionId;
    const actionName: string = req.body.actionName;
    const actionValue: string = req.body.actionValue;

    if (validator.isEmpty(actionName) || validator.isEmpty(actionValue) || !validator.isUUID(actionId)) {
      status = 400;
      throw new Error("Input value is invalid!");
    }

    step = 2;
    // check if user is exist or not
    const isEmailExist: any = await UserTableModel.findOne({ where: { email: req.email, is_deleted: false }, raw: true });
    if (!isEmailExist || isEmailExist == null || isEmailExist == undefined) {
      status = 404;
      throw new Error("User does not exist!");
    }

    step = 3;
    const isUserActive: any = await UserTableModel.findOne({ where: { email: req.email, is_active: true }, raw: true });
    if (!isUserActive || isUserActive == null || isUserActive == undefined) {
      status = 404;
      throw new Error("User does not active!");
    }

    step = 4;
    // check if action is exist or not
    const isActionExist: any = await ActionTableModel.findOne({ where: { id: actionId, is_deleted: false }, raw: true });
    if (!isActionExist || isActionExist == null || isActionExist == undefined) {
      status = 404;
      throw new Error("Action not found!");
    }

    step = 5;
    // check if action is exist 
    const isAction: any = await ActionTableModel.findOne({ where: { action_name: actionName.trim().toUpperCase(), is_deleted: false }, raw: true });
    if (isAction) {
      status = 404;
      throw new Error("Action exist, no changes requried!");
    }

    // update action in database
    let updateAction = await ActionTableModel.update({
      action_name: actionName.trim().toUpperCase(),
      action_value: actionValue.trim().toLowerCase(),
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      updated_by: req.keyId
    }, { where: { id: actionId }, transaction: tscn });

    step = 5;
    if(!('0' in updateAction) || updateAction['0'] == null || updateAction['0'] == undefined || updateAction['0'] == 0)
    { 
        status = 500; 
        throw new Error("Resource updatation failed!"); 
    }

    await tscn.commit();
    return res.status(status).json({
      status: "success",
      message: "Action updated successfully!"
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

const deleteAction = async (req: UserRequest, res: any, next: any) => {
  let step = 1, status = 200;
  const tscn = await sequelize.transaction();
  try {

    const actionId: string = req.params.actionId;

    if (!validator.isUUID(actionId)) {
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
    // check if action is exist or not
    const isActionExist: any = await ActionTableModel.findOne({ where: { id: actionId, is_deleted: false }, raw: true });
    if (!isActionExist) {
      status = 404;
      throw new Error("Action not found!");
    }

    // delete action from database
    await ActionTableModel.update({
      is_deleted: true,
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      updated_by: req.keyId
    }, { where: { id: actionId }, transaction: tscn });

    await tscn.commit();
    return res.status(status).json({
      status: "success",
      message: "Action deleted successfully!"
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



export {addAction,getActionById,getAllActions,updateAction,deleteAction};