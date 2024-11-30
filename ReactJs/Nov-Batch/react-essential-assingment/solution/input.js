export default function Input({...props}) {
    // return a <textarea> if a richText prop is true
    // return an <input> otherwise
    // forward / set the received props on the returned elements
    const {richText } = props;
    return (
        richText ? <textarea {...props}/> : <input {...props} />
        )
  }
  