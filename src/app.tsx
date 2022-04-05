import { useEffect, useState } from "react";
import { FilePicker } from "./file-picker";
import { defaultOutputOptions, OptionsView, OutputOptions } from "./options";
import { PreviewView } from "./preview";

export const App = () => {
  useEffect(() => {
    document.title = "D&D Token Generator";
  }, []);
  const [imageToRender, setImageToRender] = useState<HTMLImageElement | null>(
    null
  );

  function clearImage() {
    setImageToRender(null);
  }

  const [outputOptions, setOutputOptions] = useState<OutputOptions>(
    defaultOutputOptions
  );
  return (
    <div className="app">
      <form>
        <h1>VTT Token Generator</h1>
        <hr />
        <FilePicker setImageToRender={setImageToRender} />
        <hr />
        <OptionsView
          outputOptions={outputOptions}
          setOutputOptions={setOutputOptions}
        />
      </form>
      <PreviewView
        width={parseInt(outputOptions.outputWidth, 10)}
        height={parseInt(outputOptions.outputWidth, 10)}
        imageToRender={imageToRender}
        outputOptions={outputOptions}
        setOutputOptions={setOutputOptions}
        clearPreview={clearImage}
      />
    </div>
  );
};
