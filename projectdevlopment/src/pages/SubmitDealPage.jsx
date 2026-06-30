import React, { useState } from "react";
import Stepper from "../components/Stepper";

export default function SubmitDealPage() {
  const [step, setStep] = useState(1);
  const [url,  setUrl]  = useState("");
  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <Stepper step={step} />
      <div className="bg-white border border-slate-200 rounded-xl p-7">
        {step === 1 && (<>
          <h2 className="text-lg font-bold text-slate-900">Share a New Deal</h2>
          <p className="text-sm text-slate-500 mt-1">Paste the product link below. We'll try to find the details for you.</p>
          <label className="text-sm font-medium text-slate-700 block mt-5 mb-1.5">Product URL</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://amazon.in/product/..." className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          <button onClick={() => setStep(2)} className="w-full mt-5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium py-3 rounded-lg">Continue to Details</button>
        </>)}
        {step === 2 && (<>
          <h2 className="text-lg font-bold text-slate-900">Deal Details</h2>
          <p className="text-sm text-slate-500 mt-1">Confirm or edit the details we found for this product.</p>
          <label className="text-sm font-medium text-slate-700 block mt-5 mb-1.5">Product Title</label>
          <input placeholder="e.g. Apple iPhone 15 Pro (128GB)" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          <label className="text-sm font-medium text-slate-700 block mt-4 mb-1.5">Price (₹)</label>
          <input placeholder="e.g. 99900" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-3 rounded-lg hover:bg-slate-50">Back</button>
            <button onClick={() => setStep(3)} className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium py-3 rounded-lg">Continue to Preview</button>
          </div>
        </>)}
        {step === 3 && (<>
          <h2 className="text-lg font-bold text-slate-900">Preview & Submit</h2>
          <p className="text-sm text-slate-500 mt-1">Here's how your deal will appear to the community.</p>
          <div className="mt-5 border border-slate-200 rounded-lg p-4 text-sm text-slate-500">{url || "No URL provided"}</div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(2)} className="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-3 rounded-lg hover:bg-slate-50">Back</button>
            <button onClick={() => setStep(1)} className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium py-3 rounded-lg">Submit Deal</button>
          </div>
        </>)}
      </div>
    </div>
  );
}
