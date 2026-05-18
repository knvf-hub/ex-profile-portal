import { Navigate } from 'react-router-dom';
import { HistoryDrawer } from '../components/HistoryDrawer';
import { ProfileCard } from '../components/ProfileCard';
import { PasswordCard } from '../components/PasswordCard';
import { ProfileDetails } from '../components/ProfileDetails';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfilePhotoModal } from '../components/ProfilePhotoModal';
import { ProfileToast } from '../components/ProfileToast';
import { useProfilePage } from '../hooks/useProfilePage';

function ProfilePage() {
  const profilePage = useProfilePage();

  if (!profilePage.isAuthenticated || !profilePage.user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050720] px-6 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_45%_0%,rgba(20,33,180,0.56),transparent_32%),radial-gradient(circle_at_92%_88%,rgba(0,30,255,0.72),transparent_34%),linear-gradient(135deg,#02030d_0%,#050836_42%,#02030d_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.04)_0%,transparent_28%,rgba(255,255,255,0.035)_58%,transparent_78%)] opacity-70" />

      <section className="relative z-10 mx-auto max-w-5xl">
        <ProfileHeader
          profile={profilePage.profile}
          isEditing={profilePage.isEditing}
          isLoading={profilePage.isLoading}
          onStartEdit={profilePage.startEdit}
          onCancelEdit={profilePage.cancelEdit}
          onLogout={profilePage.handleLogout}
        />

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <ProfileCard
            user={profilePage.user}
            profile={profilePage.profile}
            photoURL={profilePage.photoURL}
            isEditing={profilePage.isEditing}
            isSaving={profilePage.isSaving}
            fileInputRef={profilePage.fileInputRef}
            onPhotoClick={profilePage.openPhotoPreview}
            onPhotoChange={profilePage.handlePhotoChange}
          />

          <div className="space-y-6">
            <ProfileDetails
              profile={profilePage.profile}
              contactForm={profilePage.contactForm}
              selectedSkills={profilePage.selectedSkills}
              skillOptions={profilePage.skillOptions}
              isEditing={profilePage.isEditing}
              isLoading={profilePage.isLoading}
              isSaving={profilePage.isSaving}
              onContactChange={profilePage.updateContactField}
              onSkillsChange={profilePage.setSelectedSkills}
              onCreateSkill={profilePage.createSkill}
              onSave={profilePage.handleSave}
              onOpenHistory={profilePage.openHistory}
            />

            <PasswordCard
              form={profilePage.passwordForm}
              isEditing={profilePage.isChangingPassword}
              isSaving={profilePage.isSaving}
              onStartEdit={profilePage.startPasswordChange}
              onCancelEdit={profilePage.cancelPasswordChange}
              onChange={profilePage.updatePasswordField}
              onSave={profilePage.handlePasswordSave}
            />
          </div>
        </div>
      </section>

      <HistoryDrawer
        isOpen={profilePage.isHistoryOpen}
        isLoading={profilePage.isHistoryLoading}
        history={profilePage.history}
        onClose={profilePage.closeHistory}
      />
      <ProfilePhotoModal photoURL={profilePage.previewPhoto} onClose={profilePage.closePhotoPreview} />
      <ProfileToast
        error={profilePage.error}
        success={profilePage.success}
        onClose={profilePage.clearToast}
      />
    </main>
  );
}

export default ProfilePage;
