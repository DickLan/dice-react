import Swal from "sweetalert2";

export const Toast = Swal.mixin({
  Toast: true,
  position: 'center',
  showConfirmButton: false,
  timer: 1500,
})