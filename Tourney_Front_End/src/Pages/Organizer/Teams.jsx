import React, { useState } from 'react';
import './CSS/Teams.css';
import { IoAdd, IoSearchOutline, IoFilterOutline, IoEyeOutline, IoCreateOutline, IoTrashOutline, IoPeopleOutline, IoClose, IoPersonOutline, IoMailOutline, IoCallOutline, IoSchoolOutline, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState('U11 BS');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: '',
      email: '',
      mobile: '',
      academyName: '',
      feesPaid: true
    }
  ]);

  // Mock teams data
  const [teams, setTeams] = useState([
    { id: 1, name: 'Saharsh D', entry: 'Online', email: 'Pbdhilip@gmail.com', mobile: '9844435599', academyName: 'SBA', event: 'U11 BS' },
    { id: 2, name: 'Tushar Raju aarya', entry: 'Online', email: 'mayauraju.raju@gmail.com', mobile: '9986745049', academyName: 'Kba', event: 'U11 BS' },
    { id: 3, name: 'RAGHAV VAIBHAV NIWARTI', entry: 'Online', email: 'vaibhav_jniwarti@rediffmail.co...', mobile: '9222575621', academyName: 'DNC', event: 'U11 BS' },
    { id: 4, name: 'Sushan Sunil Kumar', entry: 'Online', email: 'skyedapadavu@gmail.com', mobile: '9741968271', academyName: 'Selenite', event: 'U11 BS' },
    { id: 5, name: 'Vihaan Koushik', entry: 'Online', email: 'koushik.niranjan@gmail.com', mobile: '9448896450', academyName: 'SBA', event: 'U11 BS' },
    { id: 6, name: 'UNNATH A', entry: 'Online', email: 'arun.fda@gmail.com', mobile: '9972373816', academyName: 'Ranking Badminton Academy', event: 'U11 BS' },
    { id: 7, name: 'Abhimanyu Avinash', entry: 'Online', email: 'avin13@gmail.com', mobile: '9986403626', academyName: 'Nova', event: 'U11 BS' },
    { id: 8, name: 'achyuta kiran', entry: 'Online', email: 'dr_ashwinibr@yahoo.co.in', mobile: '9886362173', academyName: 'selenite sports academy', event: 'U11 BS' },
    { id: 9, name: 'VIVAAN SURI', entry: 'Online', email: 'SURI.VAR@GMAIL.COM', mobile: '9886637129', academyName: 'isports', event: 'U11 BS' },
    { id: 10, name: 'Abishek', entry: 'Online', email: 'mail.mukunda@gmail.com', mobile: '9945453969', academyName: 'BICC', event: 'U11 BS' },
    { id: 11, name: 'Nihal vijeth (RBA)', entry: 'Offline', email: '-', mobile: '-', academyName: 'NSA', event: 'U11 BS' },
    { id: 12, name: 'Parinith Dudda (RBA)', entry: 'Offline', email: '-', mobile: '-', academyName: 'NSA', event: 'U11 BS' },
    { id: 13, name: 'Aanarla (RBA)', entry: 'Offline', email: '-', mobile: '-', academyName: 'NSA', event: 'U11 BS' }
  ]);

  const events = ['U9 BS', 'U9 GS', 'U11 BS', 'U11 GS', 'U13 BS', 'U13 GS', 'U15 BS', 'U15 GS', 'U17 BS', 'U17 GS'];

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.academyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || team.entry.toLowerCase() === filterStatus;
    const matchesEvent = team.event === selectedEvent;
    return matchesSearch && matchesFilter && matchesEvent;
  });

  const handleAddTeams = () => {
    setShowAddTeamModal(true);
  };

  const handleCloseModal = () => {
    setShowAddTeamModal(false);
    setTeamMembers([{
      id: 1,
      name: '',
      email: '',
      mobile: '',
      academyName: '',
      feesPaid: true
    }]);
  };

  const handleAddMember = () => {
    const newMember = {
      id: teamMembers.length + 1,
      name: '',
      email: '',
      mobile: '',
      academyName: '',
      feesPaid: false
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const handleRemoveMember = (id) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter(member => member.id !== id));
    }
  };

  const handleMemberChange = (id, field, value) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleSubmitTeams = (e) => {
    e.preventDefault();
    
    // Add new teams to the list
    const newTeams = teamMembers.map((member, index) => ({
      id: teams.length + index + 1,
      name: member.name,
      entry: 'Online',
      email: member.email,
      mobile: member.mobile,
      academyName: member.academyName,
      event: selectedEvent
    }));

    setTeams(prev => [...prev, ...newTeams]);
    handleCloseModal();
  };

  const getEntryBadgeClass = (entry) => {
    return entry.toLowerCase() === 'online' ? 'teams-entry-online' : 'teams-entry-offline';
  };

  return (
    <div className="teams-container">
      {/* Teams Header */}
      <div className="teams-header">
        <div className="teams-title-section">
          <h2 className="teams-main-title">Tournament Teams</h2>
          <p className="teams-subtitle">Manage all registered teams and participants</p>
        </div>
        <button className="teams-add-btn" onClick={handleAddTeams}>
          <IoAdd className="teams-add-icon" />
          Add Teams
        </button>
      </div>

      {/* Teams Controls */}
      <div className="teams-controls">
        <div className="teams-event-selector">
          <label className="teams-event-label">Choose Event:</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="teams-event-select"
          >
            {events.map(event => (
              <option key={event} value={event}>{event}</option>
            ))}
          </select>
        </div>

        <div className="teams-search-wrapper">
          <IoSearchOutline className="teams-search-icon" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="teams-search-input"
          />
        </div>

        <div className="teams-filters">
          <div className="teams-filter-group">
            <IoFilterOutline className="teams-filter-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="teams-filter-select"
            >
              <option value="all">All Entry Types</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teams Table */}
      <div className="teams-table-container">
        <div className="teams-table-wrapper">
          <table className="teams-table">
            <thead className="teams-table-header">
              <tr>
                <th className="teams-th teams-th-sno">S.No</th>
                <th className="teams-th teams-th-name">Name</th>
                <th className="teams-th teams-th-entry">Entry</th>
                <th className="teams-th teams-th-email">Email</th>
                <th className="teams-th teams-th-mobile">Mobile</th>
                <th className="teams-th teams-th-academy">Academy Name</th>
                <th className="teams-th teams-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody className="teams-table-body">
              {filteredTeams.map((team, index) => (
                <tr key={team.id} className="teams-table-row">
                  <td className="teams-td teams-td-sno">{index + 1}</td>
                  <td className="teams-td teams-td-name">
                    <div className="teams-name-cell">
                      <IoPersonOutline className="teams-name-icon" />
                      <span className="teams-name-text">{team.name}</span>
                    </div>
                  </td>
                  <td className="teams-td teams-td-entry">
                    <span className={`teams-entry-badge ${getEntryBadgeClass(team.entry)}`}>
                      {team.entry}
                    </span>
                  </td>
                  <td className="teams-td teams-td-email">
                    <div className="teams-contact-cell">
                      <IoMailOutline className="teams-contact-icon" />
                      <span className="teams-contact-text">{team.email}</span>
                    </div>
                  </td>
                  <td className="teams-td teams-td-mobile">
                    <div className="teams-contact-cell">
                      <IoCallOutline className="teams-contact-icon" />
                      <span className="teams-contact-text">{team.mobile}</span>
                    </div>
                  </td>
                  <td className="teams-td teams-td-academy">
                    <div className="teams-academy-cell">
                      <IoSchoolOutline className="teams-academy-icon" />
                      <span className="teams-academy-text">{team.academyName}</span>
                    </div>
                  </td>
                  <td className="teams-td teams-td-actions">
                    <div className="teams-action-buttons">
                      <button 
                        className="teams-action-btn teams-view-btn"
                        title="View Team"
                      >
                        <IoEyeOutline />
                      </button>
                      <button 
                        className="teams-action-btn teams-edit-btn"
                        title="Edit Team"
                      >
                        <IoCreateOutline />
                      </button>
                      <button 
                        className="teams-action-btn teams-delete-btn"
                        title="Delete Team"
                      >
                        <IoTrashOutline />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teams Summary */}
      <div className="teams-summary">
        <div className="teams-summary-stats">
          <div className="teams-stat-item">
            <span className="teams-stat-label">Total Teams:</span>
            <span className="teams-stat-value">{filteredTeams.length}</span>
          </div>
          <div className="teams-stat-item">
            <span className="teams-stat-label">Online Entries:</span>
            <span className="teams-stat-value teams-stat-online">
              {filteredTeams.filter(t => t.entry === 'Online').length}
            </span>
          </div>
          <div className="teams-stat-item">
            <span className="teams-stat-label">Offline Entries:</span>
            <span className="teams-stat-value teams-stat-offline">
              {filteredTeams.filter(t => t.entry === 'Offline').length}
            </span>
          </div>
        </div>
      </div>

      {/* Add Teams Modal */}
      {showAddTeamModal && (
        <div className="teams-modal-overlay" onClick={handleCloseModal}>
          <div className="teams-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="teams-modal-header">
              <div className="teams-modal-title-section">
                <h2 className="teams-modal-title">ADD TEAMS FOR {selectedEvent}</h2>
                <p className="teams-modal-subtitle">Add multiple team members for this event</p>
              </div>
              <button className="teams-modal-close-btn" onClick={handleCloseModal}>
                <IoClose />
              </button>
            </div>

            <form onSubmit={handleSubmitTeams} className="teams-modal-form">
              <div className="teams-members-list">
                {teamMembers.map((member, index) => (
                  <div key={member.id} className="teams-member-card">
                    <div className="teams-member-header">
                      <h4 className="teams-member-title">Team Member {index + 1}</h4>
                      <div className="teams-member-actions">
                        {teamMembers.length > 1 && (
                          <button
                            type="button"
                            className="teams-remove-member-btn"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <IoCloseCircle />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="teams-member-fields">
                      <div className="teams-field-group">
                        <label className="teams-field-label">
                          NAME <span className="teams-required">*</span>
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                          placeholder="Enter full name"
                          className="teams-field-input"
                          required
                        />
                      </div>

                      <div className="teams-field-group">
                        <label className="teams-field-label">EMAIL</label>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => handleMemberChange(member.id, 'email', e.target.value)}
                          placeholder="Enter email address"
                          className="teams-field-input"
                        />
                      </div>

                      <div className="teams-field-group">
                        <label className="teams-field-label">MOBILE</label>
                        <input
                          type="tel"
                          value={member.mobile}
                          onChange={(e) => handleMemberChange(member.id, 'mobile', e.target.value)}
                          placeholder="Enter mobile number"
                          className="teams-field-input"
                        />
                      </div>

                      <div className="teams-field-group">
                        <label className="teams-field-label">ACADEMY NAME</label>
                        <input
                          type="text"
                          value={member.academyName}
                          onChange={(e) => handleMemberChange(member.id, 'academyName', e.target.value)}
                          placeholder="Enter academy name"
                          className="teams-field-input"
                        />
                      </div>

                      <div className="teams-fees-section">
                        <div className="teams-fees-toggle">
                          <label className="teams-toggle">
                            <input
                              type="checkbox"
                              checked={member.feesPaid}
                              onChange={(e) => handleMemberChange(member.id, 'feesPaid', e.target.checked)}
                              className="teams-toggle-input"
                            />
                            <span className="teams-toggle-slider"></span>
                          </label>
                          <span className="teams-toggle-label">Fees paid</span>
                        </div>
                        {member.feesPaid && (
                          <div className="teams-fees-amount">
                            <span className="teams-fees-badge">INR 599</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="teams-add-member-section">
                <button
                  type="button"
                  className="teams-add-member-btn"
                  onClick={handleAddMember}
                >
                  <IoAdd className="teams-add-member-icon" />
                  Add Another Member
                </button>
              </div>

              <div className="teams-form-note">
                <span className="teams-note-text">* Mandatory fields, provide valid data</span>
              </div>

              <div className="teams-modal-actions">
                <button 
                  type="button" 
                  className="teams-modal-btn teams-modal-cancel"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="teams-modal-btn teams-modal-save"
                >
                  Save Teams
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredTeams.length === 0 && (
        <div className="teams-empty-state">
          <div className="teams-empty-content">
            <IoPeopleOutline className="teams-empty-icon" />
            <h3 className="teams-empty-title">No teams found</h3>
            <p className="teams-empty-text">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : `No teams registered for ${selectedEvent} yet`
              }
            </p>
            <button className="teams-empty-btn" onClick={handleAddTeams}>
              <IoAdd className="teams-empty-btn-icon" />
              Add First Team
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
