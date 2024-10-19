import domtoimage from 'dom-to-image-more'

export async function makeScreenshot(elem: HTMLElement): Promise<string> {
  return await domtoimage.toJpeg(elem, {
    copyDefaultStyles: false,
    scale: 3.0,
  })
}

export function dataURItoBlob(dataURI: string) {
  const binary = atob(dataURI.split(',')[1])
  const array = []
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }
  return new Blob([new Uint8Array(array)], { type: 'image/jpeg' })
}

// function adjust(_:any, clone: HTMLElement, after: boolean) {
//   if (!after) {
//     if (clone.classList && clone.classList.contains('p-datatable-table-container')) {
//       clone.style.overflow = "visible";
//       clone.style.maxWidth = "1500px";
//     }
//     if (clone.classList && clone.classList.contains('p-datatable-header')) {
//     }
//     if (clone.id === "screenshotElement") {
//       clone.style.width = "fit-content";
//       clone.style.maxWidth = "1500px";
//     }
//   }
//   return clone
// }
//
// function onClone(node: HTMLElement) {
//   // node.style.width = "fit-content";
//   return node;
// }
