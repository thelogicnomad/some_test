import React, { useState } from 'react';
import './CSS/Settings.css';
import { IoSaveOutline, IoRefreshOutline, IoEyeOutline, IoEyeOffOutline, IoInformationCircleOutline, IoAdd, IoTrashOutline, IoGlobeOutline, IoLockClosedOutline, IoMailOutline, IoCallOutline, IoPersonOutline } from 'react-icons/io5';

const Settings = () => {
  const [settingsData, setSettingsData] = useState({
    // Tournament Basic Info
    tournamentName: 'YONEX KARNATAKA STATE OPEN JUNIOR BADMINTON CHAMPIONSHIP',
    tournamentUrl: 'https://playmatches.com/bengaluru/tournaments/detail/yonex-karnataka-state-open-junior-badminton-championship/20a4f543-5503-4d4c-b26f-beb04233af5d',
    otp: '456789',
    
    // Tournament Visibility & Settings
    isPublicTournament: true,
    seedingOptionInFixtures: false,
    askEmailFromPlayer: true,
    askMobileFromPlayer: true,
    askAdditionalInfo: true,
    showFixtures: true,
    
    // Custom Fields
    customFields: [
      {
        id: 1,
        fieldName: 'Academy Name',
        hintText: 'Enter your Academy name',
        isMandatory: true,
        displayInFixture: true
      }
    ]
  });

  const [showOtp, setShowOtp] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleInputChange = (field, value) => {
    setSettingsData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleToggleChange = (field) => {
    setSettingsData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    setHasUnsavedChanges(true);
  };

  const handleCustomFieldChange = (id, field, value) => {
    setSettingsData(prev => ({
      ...prev,
      customFields: prev.customFields.map(customField =>
        customField.id === id ? { ...customField, [field]: value } : customField
      )
    }));
    setHasUnsavedChanges(true);
  };

  const addCustomField = () => {
    const newField = {
      id: Date.now(),
      fieldName: '',
      hintText: '',
      isMandatory: false,
      displayInFixture: false
    };
    setSettingsData(prev => ({
      ...prev,
      customFields: [...prev.customFields, newField]
    }));
    setHasUnsavedChanges(true);
  };

  const removeCustomField = (id) => {
    setSettingsData(prev => ({
      ...prev,
      customFields: prev.customFields.filter(field => field.id !== id)
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settingsData);
    setHasUnsavedChanges(false);
    // Here you would typically make an API call to save the settings
  };

  const handleResetSettings = () => {
    // Reset to default values or refetch from server
    setHasUnsavedChanges(false);
  };

  return (
    <div className="settings-container">
      {/* Settings Header */}
      <div className="settings-header">
        <div className="settings-title-section">
          <h2 className="settings-main-title">Tournament Settings</h2>
          <p className="settings-subtitle">Configure tournament preferences and visibility options</p>
        </div>
        <div className="settings-header-actions">
          <button 
            className="settings-action-btn settings-reset-btn" 
            onClick={handleResetSettings}
          >
            <IoRefreshOutline className="settings-action-icon" />
            Reset
          </button>
          <button 
            className={`settings-action-btn settings-save-btn ${hasUnsavedChanges ? 'settings-save-active' : ''}`}
            onClick={handleSaveSettings}
          >
            <IoSaveOutline className="settings-action-icon" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="settings-content">
        {/* Tournament Information Section */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h3 className="settings-section-title">Tournament Information</h3>
            <p className="settings-section-description">Basic tournament details and identification</p>
          </div>
          
          <div className="settings-section-content">
            <div className="settings-form-group">
              <label className="settings-form-label">
                Tournament Name
                <span className="settings-required">*</span>
              </label>
              <input
                type="text"
                value={settingsData.tournamentName}
                onChange={(e) => handleInputChange('tournamentName', e.target.value)}
                className="settings-form-input"
                placeholder="Enter tournament name"
              />
            </div>

            <div className="settings-form-group">
              <label className="settings-form-label">
                Tournament URL
                <IoInformationCircleOutline className="settings-info-icon" title="Public URL for tournament registration" />
              </label>
              <div className="settings-url-input-wrapper">
                <IoGlobeOutline className="settings-url-icon" />
                <input
                  type="url"
                  value={settingsData.tournamentUrl}
                  onChange={(e) => handleInputChange('tournamentUrl', e.target.value)}
                  className="settings-form-input settings-url-input"
                  placeholder="Tournament URL"
                  readOnly
                />
              </div>
            </div>

            <div className="settings-form-group">
              <label className="settings-form-label">
                OTP (One Time Password)
                <IoInformationCircleOutline className="settings-info-icon" title="Security code for tournament access" />
              </label>
              <div className="settings-otp-wrapper">
                <div className="settings-otp-input-wrapper">
                  <IoLockClosedOutline className="settings-otp-icon" />
                  <input
                    type={showOtp ? "text" : "password"}
                    value={settingsData.otp}
                    onChange={(e) => handleInputChange('otp', e.target.value)}
                    className="settings-form-input settings-otp-input"
                    placeholder="Enter OTP"
                  />
                  <button
                    type="button"
                    className="settings-otp-toggle"
                    onClick={() => setShowOtp(!showOtp)}
                  >
                    {showOtp ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Visibility Section */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h3 className="settings-section-title">Tournament Visibility & Access</h3>
            <p className="settings-section-description">Control who can see and access your tournament</p>
          </div>
          
          <div className="settings-section-content">
            <div className="settings-toggle-group">
              <div className="settings-toggle-item">
                <div className="settings-toggle-content">
                  <div className="settings-toggle-info">
                    <h4 className="settings-toggle-title">Public Tournament</h4>
                    <p className="settings-toggle-description">
                      Turning 'ON' will list your tournament in https://playmatches.com and allow anyone to participate
                    </p>
                  </div>
                  <div className="settings-toggle-wrapper">
                    <label className="settings-toggle">
                      <input
                        type="checkbox"
                        checked={settingsData.isPublicTournament}
                        onChange={() => handleToggleChange('isPublicTournament')}
                        className="settings-toggle-input"
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-toggle-item">
                <div className="settings-toggle-content">
                  <div className="settings-toggle-info">
                    <h4 className="settings-toggle-title">Seeding Option in Fixtures</h4>
                    <p className="settings-toggle-description">
                      Enable seeding options for better tournament bracket organization
                    </p>
                  </div>
                  <div className="settings-toggle-wrapper">
                    <label className="settings-toggle">
                      <input
                        type="checkbox"
                        checked={settingsData.seedingOptionInFixtures}
                        onChange={() => handleToggleChange('seedingOptionInFixtures')}
                        className="settings-toggle-input"
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-toggle-item">
                <div className="settings-toggle-content">
                  <div className="settings-toggle-info">
                    <h4 className="settings-toggle-title">Show Fixtures</h4>
                    <p className="settings-toggle-description">
                      Display tournament fixtures and match schedules to participants
                    </p>
                  </div>
                  <div className="settings-toggle-wrapper">
                    <label className="settings-toggle">
                      <input
                        type="checkbox"
                        checked={settingsData.showFixtures}
                        onChange={() => handleToggleChange('showFixtures')}
                        className="settings-toggle-input"
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Player Information Section */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h3 className="settings-section-title">Player Information Requirements</h3>
            <p className="settings-section-description">Configure what information to collect from players during registration</p>
          </div>
          
          <div className="settings-section-content">
            <div className="settings-toggle-group">
              <div className="settings-toggle-item">
                <div className="settings-toggle-content">
                  <div className="settings-toggle-info">
                    <div className="settings-toggle-title-with-icon">
                      <IoMailOutline className="settings-toggle-icon" />
                      <h4 className="settings-toggle-title">Ask Email ID from Player</h4>
                    </div>
                    <p className="settings-toggle-description">
                      Collect email addresses from players while booking
                    </p>
                  </div>
                  <div className="settings-toggle-wrapper">
                    <label className="settings-toggle">
                      <input
                        type="checkbox"
                        checked={settingsData.askEmailFromPlayer}
                        onChange={() => handleToggleChange('askEmailFromPlayer')}
                        className="settings-toggle-input"
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-toggle-item">
                <div className="settings-toggle-content">
                  <div className="settings-toggle-info">
                    <div className="settings-toggle-title-with-icon">
                      <IoCallOutline className="settings-toggle-icon" />
                      <h4 className="settings-toggle-title">Ask Mobile Number from Player</h4>
                    </div>
                    <p className="settings-toggle-description">
                      Collect mobile numbers from players while booking
                    </p>
                  </div>
                  <div className="settings-toggle-wrapper">
                    <label className="settings-toggle">
                      <input
                        type="checkbox"
                        checked={settingsData.askMobileFromPlayer}
                        onChange={() => handleToggleChange('askMobileFromPlayer')}
                        className="settings-toggle-input"
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-toggle-item">
                <div className="settings-toggle-content">
                  <div className="settings-toggle-info">
                    <div className="settings-toggle-title-with-icon">
                      <IoPersonOutline className="settings-toggle-icon" />
                      <h4 className="settings-toggle-title">Ask Additional Information from Player</h4>
                    </div>
                    <p className="settings-toggle-description">
                      Collect custom information from players while booking
                    </p>
                  </div>
                  <div className="settings-toggle-wrapper">
                    <label className="settings-toggle">
                      <input
                        type="checkbox"
                        checked={settingsData.askAdditionalInfo}
                        onChange={() => handleToggleChange('askAdditionalInfo')}
                        className="settings-toggle-input"
                      />
                      <span className="settings-toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Fields Section */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h3 className="settings-section-title">Custom Fields</h3>
            <p className="settings-section-description">Define additional fields to collect specific information from players</p>
          </div>
          
          <div className="settings-section-content">
            <div className="settings-custom-fields">
              {settingsData.customFields.map((field) => (
                <div key={field.id} className="settings-custom-field-card">
                  <div className="settings-custom-field-header">
                    <h4 className="settings-custom-field-title">Custom Field</h4>
                    {settingsData.customFields.length > 1 && (
                      <button
                        className="settings-remove-field-btn"
                        onClick={() => removeCustomField(field.id)}
                      >
                        <IoTrashOutline />
                      </button>
                    )}
                  </div>
                  
                  <div className="settings-custom-field-content">
                    <div className="settings-custom-field-row">
                      <div className="settings-form-group">
                        <label className="settings-form-label">Field Name</label>
                        <input
                          type="text"
                          value={field.fieldName}
                          onChange={(e) => handleCustomFieldChange(field.id, 'fieldName', e.target.value)}
                          className="settings-form-input"
                          placeholder="e.g. Academy Name"
                        />
                      </div>
                      
                      <div className="settings-form-group">
                        <label className="settings-form-label">Hint Text</label>
                        <input
                          type="text"
                          value={field.hintText}
                          onChange={(e) => handleCustomFieldChange(field.id, 'hintText', e.target.value)}
                          className="settings-form-input"
                          placeholder="e.g. Enter your Academy name"
                        />
                      </div>
                    </div>
                    
                    <div className="settings-custom-field-toggles">
                      <div className="settings-custom-field-toggle">
                        <label className="settings-toggle">
                          <input
                            type="checkbox"
                            checked={field.isMandatory}
                            onChange={(e) => handleCustomFieldChange(field.id, 'isMandatory', e.target.checked)}
                            className="settings-toggle-input"
                          />
                          <span className="settings-toggle-slider settings-toggle-small"></span>
                        </label>
                        <span className="settings-toggle-label">Is mandatory?</span>
                      </div>
                      
                      <div className="settings-custom-field-toggle">
                        <label className="settings-toggle">
                          <input
                            type="checkbox"
                            checked={field.displayInFixture}
                            onChange={(e) => handleCustomFieldChange(field.id, 'displayInFixture', e.target.checked)}
                            className="settings-toggle-input"
                          />
                          <span className="settings-toggle-slider settings-toggle-small"></span>
                        </label>
                        <span className="settings-toggle-label">Display in fixture?</span>
                        <IoInformationCircleOutline className="settings-info-icon" title="Show this field in tournament fixtures" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="settings-add-field-btn" onClick={addCustomField}>
                <IoAdd className="settings-add-field-icon" />
                Add Custom Field
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div className="settings-unsaved-banner">
          <div className="settings-unsaved-content">
            <span className="settings-unsaved-text">You have unsaved changes</span>
            <div className="settings-unsaved-actions">
              <button 
                className="settings-unsaved-btn settings-unsaved-discard"
                onClick={handleResetSettings}
              >
                Discard
              </button>
              <button 
                className="settings-unsaved-btn settings-unsaved-save"
                onClick={handleSaveSettings}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
