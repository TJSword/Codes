import { ElMessage, ElMessageBox } from "element-plus";

export default {
  message: ElMessage,
  error: ElMessage.error,
  info: ElMessage.info,
  warning: ElMessage.warning,
  success: ElMessage.success,
  confirm: ElMessageBox.confirm
};
