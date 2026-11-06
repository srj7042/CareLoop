import * as React from "react";
import {
  User as UserIcon,
  Building,
  Phone,
  Mail,
  CheckCircle2,
  X,
  LogOut,
  Edit3,
  Plus,
  Trash2,
  Save,
  Undo2,
  Briefcase,
  MapPin,
  FileText,
  AlertCircle,
  Tag,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { UserCustomField } from "@/types";

export const ProfileModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { currentUser, currentRole, cases, logout, updateCurrentUserProfile } = useStore();

  const [isEditing, setIsEditing] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  // Editable Form State
  const [formData, setFormData] = React.useState({
    name: "",
    title: "",
    phone: "",
    secondaryPhone: "",
    department: "",
    facility: "",
    bio: "",
  });

  // Custom Fields (Add / Remove / Update)
  const [customFields, setCustomFields] = React.useState<UserCustomField[]>([]);
  const [newFieldLabel, setNewFieldLabel] = React.useState("");
  const [newFieldValue, setNewFieldValue] = React.useState("");

  // Sync state whenever modal opens or currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        title: currentUser.title || "",
        phone: currentUser.phone || "",
        secondaryPhone: currentUser.secondaryPhone || "",
        department: currentUser.department || "",
        facility: currentUser.facility || "",
        bio: currentUser.bio || "",
      });
      setCustomFields(currentUser.customFields ? [...currentUser.customFields] : []);
      setIsEditing(false);
      setSuccessMessage("");
      setErrorMessage("");
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  // Compute workload for current user
  const userCases = cases.filter((c) => c.currentOwner === currentUser.id);
  const openCount = userCases.filter((c) => c.status === "open").length;
  const closedCount = userCases.filter((c) => c.status === "closed").length;
  const overdueCount = userCases.filter((c) => c.sideState === "overdue").length;
  const roleConfig = currentRole ? ROLE_PERMISSIONS[currentRole] : null;

  const handleSignOut = () => {
    onClose();
    logout();
    window.location.href = "/login";
  };

  // Add a new custom field
  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) {
      setErrorMessage("Please enter a field label (e.g., 'Pager Number' or 'Office Room').");
      return;
    }
    if (!newFieldValue.trim()) {
      setErrorMessage("Please enter a value for the field.");
      return;
    }

    const newField: UserCustomField = {
      id: `field_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      label: newFieldLabel.trim(),
      value: newFieldValue.trim(),
    };

    setCustomFields([...customFields, newField]);
    setNewFieldLabel("");
    setNewFieldValue("");
    setErrorMessage("");
  };

  // Remove a custom field
  const handleRemoveCustomField = (id: string) => {
    setCustomFields(customFields.filter((f) => f.id !== id));
  };

  // Update a custom field's value
  const handleUpdateCustomField = (id: string, value: string) => {
    setCustomFields(
      customFields.map((f) => (f.id === id ? { ...f, value } : f))
    );
  };

  // Save changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage("Full Name is mandatory.");
      return;
    }

    updateCurrentUserProfile({
      name: formData.name.trim(),
      title: formData.title.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      secondaryPhone: formData.secondaryPhone.trim() || undefined,
      department: formData.department.trim() || undefined,
      facility: formData.facility.trim() || undefined,
      bio: formData.bio.trim() || undefined,
      customFields: customFields.length > 0 ? customFields : undefined,
    });

    setSuccessMessage("Personal information updated successfully!");
    setErrorMessage("");
    setIsEditing(false);

    // Auto-clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleCancelEdit = () => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        title: currentUser.title || "",
        phone: currentUser.phone || "",
        secondaryPhone: currentUser.secondaryPhone || "",
        department: currentUser.department || "",
        facility: currentUser.facility || "",
        bio: currentUser.bio || "",
      });
      setCustomFields(currentUser.customFields ? [...currentUser.customFields] : []);
    }
    setIsEditing(false);
    setErrorMessage("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-deep/50 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="bg-white border border-[#E8ECE9] rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Landing Page Deep Forest & Sage */}
        <div className="bg-gradient-to-r from-[#1E2522] via-[#2A342F] to-[#1E2522] text-white p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E7F2ED] border-2 border-white/30 flex items-center justify-center text-xl font-black text-[#1E2522] shadow-md">
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">{currentUser.name}</h3>
                  {currentUser.title && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-[#F7F8F5] font-semibold">
                      {currentUser.title}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#C2CEC8] font-semibold">
                  {roleConfig?.roleTitle || currentUser.role}
                </p>
                <p className="text-[11px] text-[#A0B0A8]/80 flex items-center gap-1 mt-1">
                  <Building size={12} /> {currentUser.organizationName}
                </p>
              </div>
            </div>

            {!isEditing && (
              <Button
                size="sm"
                onClick={() => setIsEditing(true)}
                className="bg-[#609983] hover:bg-[#4D7D6B] text-white font-bold text-xs h-9 px-3 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Edit3 size={13} />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Status Notification Alerts */}
        {successMessage && (
          <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="px-6 py-2.5 bg-red-50 border-b border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={15} className="text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* VIEW MODE */}
          {!isEditing ? (
            <>
              {/* Workload Snapshot */}
              <div>
                <p className="text-xs font-extrabold text-[#1E2522] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Briefcase size={14} className="text-[#609983]" />
                  Assignment &amp; Case Ownership
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-white border border-[#E8ECE9] text-center shadow-xs card-hover-subtle">
                    <p className="text-xl font-black text-[#1E2522]">{openCount}</p>
                    <p className="text-[11px] text-[#5B6660] font-medium">Assigned Open</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#E7F2ED] border border-[#C6DDD3] text-center shadow-xs card-hover-subtle">
                    <p className="text-xl font-black text-[#609983]">{closedCount}</p>
                    <p className="text-[11px] text-[#1E2522] font-medium">Loops Closed</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-center shadow-xs card-hover-subtle">
                    <p className="text-xl font-black text-red-600">{overdueCount}</p>
                    <p className="text-[11px] text-red-700 font-medium">Overdue</p>
                  </div>
                </div>
              </div>

              {/* Personal Information & Credentials */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-[#1E2522] uppercase tracking-wider flex items-center gap-1.5">
                    <UserIcon size={14} className="text-[#609983]" />
                    Personal &amp; Contact Information
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[11px] font-bold text-[#609983] hover:text-[#4D7D6B] hover:underline flex items-center gap-1"
                  >
                    <Edit3 size={11} /> Update
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E8ECE9] space-y-2.5 shadow-xs card-hover-subtle">
                  <div className="flex justify-between items-center py-1 border-b border-[#E8ECE9]/60">
                    <span className="text-[#5B6660] font-medium">Full Name:</span>
                    <span className="font-bold text-[#1E2522]">{currentUser.name}</span>
                  </div>

                  {currentUser.title && (
                    <div className="flex justify-between items-center py-1 border-b border-[#E8ECE9]/60">
                      <span className="text-[#5B6660] font-medium">Professional Title:</span>
                      <span className="font-semibold text-[#1E2522]">{currentUser.title}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-1 border-b border-[#E8ECE9]/60">
                    <span className="text-[#5B6660] font-medium">Clinical Email:</span>
                    <span className="font-mono font-semibold text-[#609983] text-[11px]">
                      {currentUser.email}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-[#E8ECE9]/60">
                    <span className="text-[#5B6660] font-medium">Direct Phone:</span>
                    <span className="font-semibold text-[#1E2522]">
                      {currentUser.phone || "Not set"}
                    </span>
                  </div>

                  {currentUser.secondaryPhone && (
                    <div className="flex justify-between items-center py-1 border-b border-[#E8ECE9]/60">
                      <span className="text-[#5B6660] font-medium">Emergency / Alt Phone:</span>
                      <span className="font-semibold text-[#1E2522]">
                        {currentUser.secondaryPhone}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-1 border-b border-[#E8ECE9]/60">
                    <span className="text-[#5B6660] font-medium">Department:</span>
                    <span className="font-semibold text-[#1E2522]">
                      {currentUser.department || "Clinical Care"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-[#E8ECE9]/60">
                    <span className="text-[#5B6660] font-medium">Primary Facility:</span>
                    <span className="font-semibold text-[#1E2522]">{currentUser.facility}</span>
                  </div>

                  {currentUser.bio && (
                    <div className="pt-1.5">
                      <span className="text-[#5B6660] font-medium block mb-1">Professional Bio / Notes:</span>
                      <p className="p-2.5 rounded-xl bg-[#F7F8F5] text-[#1E2522] text-xs leading-relaxed border border-[#E8ECE9]">
                        {currentUser.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Personal Details Added by User */}
              {currentUser.customFields && currentUser.customFields.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-extrabold text-[#1E2522] uppercase tracking-wider flex items-center gap-1.5">
                    <Tag size={14} className="text-[#609983]" />
                    Additional Personal Fields ({currentUser.customFields.length})
                  </p>
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E8ECE9] space-y-2 shadow-xs">
                    {currentUser.customFields.map((field) => (
                      <div
                        key={field.id}
                        className="flex justify-between items-center py-1 border-b border-[#E8ECE9]/50 last:border-0"
                      >
                        <span className="text-[#5B6660] font-medium">{field.label}:</span>
                        <span className="font-bold text-[#1E2522]">{field.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* EDIT MODE - Update, Add, Remove */
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8ECE9]">
                <span className="font-extrabold text-sm text-[#1E2522] flex items-center gap-1.5">
                  <Edit3 size={15} className="text-[#609983]" />
                  Edit Personal Information
                </span>
                <span className="text-[11px] text-[#5B6660]">
                  Update values, add new attributes, or remove fields
                </span>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#1E2522] uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-white border-2 border-[#E8ECE9] focus:border-[#609983] focus:ring-2 focus:ring-[#609983]/15 text-[#1E2522] font-semibold text-xs outline-none"
                    placeholder="e.g. Sarah Thompson"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1E2522] uppercase tracking-wider mb-1">
                    Title / Credentials
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-white border-2 border-[#E8ECE9] focus:border-[#609983] focus:ring-2 focus:ring-[#609983]/15 text-[#1E2522] font-semibold text-xs outline-none"
                    placeholder="e.g. BSN, RN or MD, FACS"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1E2522] uppercase tracking-wider mb-1">
                    Direct Clinical Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-white border-2 border-[#E8ECE9] focus:border-[#609983] focus:ring-2 focus:ring-[#609983]/15 text-[#1E2522] font-semibold text-xs outline-none"
                    placeholder="+1 (555) 100-2004"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1E2522] uppercase tracking-wider mb-1">
                    Alternate / Emergency Phone
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryPhone}
                    onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-white border-2 border-[#E8ECE9] focus:border-[#609983] focus:ring-2 focus:ring-[#609983]/15 text-[#1E2522] font-semibold text-xs outline-none"
                    placeholder="+1 (555) 999-8888"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1E2522] uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-white border-2 border-[#E8ECE9] focus:border-[#609983] focus:ring-2 focus:ring-[#609983]/15 text-[#1E2522] font-semibold text-xs outline-none"
                    placeholder="e.g. Care Coordination"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1E2522] uppercase tracking-wider mb-1">
                    Facility Location
                  </label>
                  <input
                    type="text"
                    value={formData.facility}
                    onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-white border-2 border-[#E8ECE9] focus:border-[#609983] focus:ring-2 focus:ring-[#609983]/15 text-[#1E2522] font-semibold text-xs outline-none"
                    placeholder="e.g. Apex Ambulatory Pavilion"
                  />
                </div>
              </div>

              {/* Bio / Summary */}
              <div>
                <label className="block text-[11px] font-bold text-[#1E2522] uppercase tracking-wider mb-1">
                  Professional Bio / Clinical Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white border-2 border-[#E8ECE9] focus:border-[#609983] focus:ring-2 focus:ring-[#609983]/15 text-[#1E2522] font-medium text-xs outline-none resize-none"
                  placeholder="Specializations, clinical responsibilities, or languages spoken..."
                />
              </div>

              {/* Custom Fields - Add & Remove */}
              <div className="pt-2 border-t border-[#E8ECE9] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-extrabold text-[#1E2522] uppercase tracking-wider">
                    Custom Attributes &amp; Contacts
                  </label>
                  <span className="text-[10px] text-[#5B6660]">
                    {customFields.length} field{customFields.length === 1 ? "" : "s"} added
                  </span>
                </div>

                {/* Existing custom fields with Remove option */}
                {customFields.length > 0 && (
                  <div className="space-y-2">
                    {customFields.map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8ECE9]"
                      >
                        <div className="w-1/3">
                          <span className="text-[11px] font-bold text-[#1E2522] truncate block">
                            {field.label}
                          </span>
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => handleUpdateCustomField(field.id, e.target.value)}
                            className="w-full h-8 px-2.5 rounded-lg bg-[#F7F8F5] border border-[#E8ECE9] text-[#1E2522] text-xs font-semibold outline-none focus:border-[#609983]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomField(field.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title={`Remove ${field.label}`}
                          aria-label={`Remove ${field.label}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Custom Field Form */}
                <div className="p-3.5 rounded-2xl bg-[#F7F8F5] border border-[#C6DDD3] space-y-2.5">
                  <span className="text-[11px] font-bold text-[#609983] block">
                    + Add New Personal Information Field
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                        placeholder="Label (e.g. Pager #, Room)"
                        className="w-full h-8 px-2.5 rounded-lg bg-white border border-[#E8ECE9] text-[#1E2522] text-xs outline-none focus:border-[#609983]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={newFieldValue}
                        onChange={(e) => setNewFieldValue(e.target.value)}
                        placeholder="Value (e.g. Ext 4402)"
                        className="w-full h-8 px-2.5 rounded-lg bg-white border border-[#E8ECE9] text-[#1E2522] text-xs outline-none focus:border-[#609983]"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <button
                        type="button"
                        onClick={handleAddCustomField}
                        className="w-full h-8 px-2.5 rounded-lg bg-[#609983] hover:bg-[#4D7D6B] text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                      >
                        <Plus size={13} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Actions: Save / Cancel */}
              <div className="pt-3 border-t border-[#E8ECE9] flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="text-xs border-[#E8ECE9] text-[#5B6660] hover:bg-[#E7F2ED] font-semibold h-9 px-4 rounded-xl flex items-center gap-1.5"
                >
                  <Undo2 size={13} /> Cancel
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#609983] hover:bg-[#4D7D6B] text-white font-extrabold text-xs h-9 px-5 rounded-xl shadow-md shadow-[#609983]/20 flex items-center gap-1.5"
                >
                  <Save size={13} /> Save Profile Changes
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Footer with Sign Out */}
        <div className="p-4 bg-[#F7F8F5] border-t border-[#E8ECE9] flex items-center justify-between flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSignOut}
            className="text-xs font-bold text-[#DC2626] hover:bg-[#FEE2E2] border-[#E8ECE9] flex items-center gap-1.5 rounded-xl h-8"
          >
            <LogOut size={13} /> Sign Out of CareLoop
          </Button>

          {!isEditing && (
            <Button
              size="sm"
              onClick={onClose}
              className="bg-[#1E2522] hover:bg-[#2A342F] text-white text-xs font-semibold rounded-xl h-8 px-4"
            >
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
